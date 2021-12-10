/* eslint-disable no-console */
import { action, computed, observable } from 'mobx';
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IMicrophoneAudioTrack,
  UID,
} from 'agora-rtc-sdk-ng';

import { ClientEvents } from './events';

import {
  EDiscussionLocalStorageKeys,
  EUserState,
  IDiscussionInfo,
  IDiscussionInitParams,
  IDiscussionLocalStorageData,
  ILocalUser,
  IUser,
} from './types';
import RoomApiService from './api/RoomApiService';
import { defaultApi } from './config';


class RoomStore {
  protected api = new RoomApiService();
  // Agora clients
  @observable client: IAgoraRTCClient | undefined;
  @observable screenClient: IAgoraRTCClient | undefined;

  // Users
  @observable localUser: ILocalUser = {};
  @observable agoraRemoteUsers: Array<IAgoraRTCRemoteUser> = [];
  @observable idToUser: Map<number | string, IUser> = new Map();

  // Controls
  @observable isCameraMuted: boolean = false;
  @observable isMicrophoneMuted: boolean = false;
  @observable isScreenSharing: boolean = false;
  @observable isOtherUserScreenSharing: boolean = false;

  // Sidebar
  @observable isAttendeesOpened: boolean = false;

  // Devices & tracks
  @observable devices: MediaDeviceInfo[] = [];

  @observable microphoneTrack: IMicrophoneAudioTrack | undefined;
  @observable cameraTrack: ICameraVideoTrack | undefined;
  @observable screenTracks: ILocalVideoTrack | [ILocalVideoTrack, ILocalAudioTrack] | undefined;
  @observable localScreenSharingUid: UID = 0;

  // Utils
  @observable info: IDiscussionInfo = {
    creator: {},
  };

  @observable discLocalStorageData: IDiscussionLocalStorageData = {
    user: {},
  };

  @observable isDiscLocalStorageDataChecked: boolean = false;

  @action
  init = ({ userName, nameRoom }: IDiscussionInitParams) => {
    this.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

    if (!this.localUser.name) {
      this.localUser = {
        name: userName || this.localUser.name,
      };
    }

    this.info = { ...this.info, channel: nameRoom };
  };

  @action
  clear = () => {
    this.isCameraMuted = false;
    this.isMicrophoneMuted = false;
    this.isScreenSharing = false;
    this.isOtherUserScreenSharing = false;

    this.isAttendeesOpened = false;

    this.localUser = {};
    this.agoraRemoteUsers = [];
    this.idToUser.clear();

    this.info = {
      creator: {},
    };

    this.localScreenSharingUid = 0;

  };

  // Main call methods ---------------------------------------------------------
  @action
  join = async () => {
    if (!this.client) {
      return;
    }

    this.addHandlers();

    // Check if a user was connected before don't joinOnServer again
    if (this.discLocalStorageData?.user?.name) {
      //await Promise.all([this.getUsers(), this.getDevices()]);
    } else {
      await Promise.all([this.joinOnServer(), this.getDevices()]);
    }


    const [microphoneTrack] = await Promise.all([
      AgoraRTC.createMicrophoneAudioTrack({encoderConfig: 'high_quality'}),
      this.client.join(
        defaultApi.APP_ID,
        this.info.channel as string,
        this.localUser.rtcToken as string,
        this.localUser.uid
      ),
    ]);

    this.microphoneTrack = microphoneTrack;

    await this.client.publish([microphoneTrack]);

    (window as any).client = this.client;
  };

  @action
  joinOnServer = async () => {
    const joinDiscURL = `/rtctoken`;
    const requestData = {
      channel: 'burger',
      isPublisher: true,
    };

    return this.api
      .join(joinDiscURL, requestData)
      .then(async (res: any) => {
        //console.log('%cDiscussion:', CONSOLE_LOG_SCOPE_COLOR, 'join on server Data: ', res); // eslint-disable-line no-console

        this.localUser.rtcToken = res.token;
        this.localUser.uid = res.uid;

        this.discLocalStorageData = {
          user: {
            token: res.token,
            uid: res.uid,
          },
        };

        localStorage.setItem(
          EDiscussionLocalStorageKeys.DATA,
          JSON.stringify(this.discLocalStorageData)
        );

        return Promise.resolve(res);
      })
      .catch((error: any) => {
        console.error('Discussion: join on server error', error);

        return Promise.reject(error);
      });
  };

  @action
  leave = async () => {
    this.stopMicrophoneTrack();

   
    await this.client?.leave();

    this.removeHandlers();
  };

  // Users ---------------------------------------------------------
  @computed
  get users() {
    // TODO: temporary solution for the incorrect leave discussion issue
    return Array.from(this.idToUser.values()).filter((user) => {
      const isValidUser =
        this.remoteUsers.find((remoteUser) => remoteUser.uid === user.uid) ||
        this.localUser.uid === user.uid;

      return isValidUser && user.state === EUserState.GRANTED && user.name;
    });
  }

  @computed
  get remoteUsers() {
    const screenSharingUserUid = this.screenSharingUserUid;

    return this.agoraRemoteUsers.filter((user) => user.uid !== screenSharingUserUid);
  }

  @computed
  get screenSharingUser() {
    const screenSharingUserUid = this.screenSharingUserUid;

    return this.agoraRemoteUsers.find((user) => user.uid === screenSharingUserUid) || null;
  }

  @computed
  get screenSharingUserName() {
    return Array.from(this.idToUser.values()).find((user) => user.shareId)?.name;
  }

  @computed
  get screenSharingUserUid() {
    return Array.from(this.idToUser.values()).find((user) => user.shareId)?.shareId;
  }

  getAtLeastOneScreenSharingUserWithVideo = () => {
    const screenSharingUserUid = this.screenSharingUserUid;

    return (
      this.agoraRemoteUsers.find((user) => user.uid === screenSharingUserUid && !!user.hasVideo) ||
      null
    );
  };

  @action
  getDevices = () => {
    return AgoraRTC.getDevices()
      .then((devices) => {
        //console.log('%cDiscussion:', CONSOLE_LOG_SCOPE_COLOR, 'devices', devices);

        this.devices = devices.slice();
      })
      .catch((error) => {
        console.error('Discussion: get devices error', error);
      });
  };

  

  @action
  stopMicrophoneTrack = () => {
    if (this.microphoneTrack) {
      this.microphoneTrack.stop();
      this.microphoneTrack.close();
    }
  };



  // // Event handlers ---------------------------------------------------------
  @action
  updateRemoteUsers = () => {
    if(!this.client){
      return
    }
    this.agoraRemoteUsers = Array.from(this.client.remoteUsers);
  };

  @action
  addHandlers = () => {
    if(!this.client){
      return
    }
    this.client.on(ClientEvents.onUserPublished, this.handleUserPublished);
    this.client.on(ClientEvents.onUserUnpublished, this.handleUserUnpublished);
    this.client.on(ClientEvents.onUserJoined, this.handleUserJoined);
    this.client.on(ClientEvents.onUserLeft, this.handleUserLeft);
  };

  @action
  removeHandlers = () => {
    if(!this.client){
      return
    }
    this.client.off(ClientEvents.onUserPublished, this.handleUserPublished);
    this.client.off(ClientEvents.onUserUnpublished, this.handleUserUnpublished);
    this.client.off(ClientEvents.onUserJoined, this.handleUserJoined);
    this.client.off(ClientEvents.onUserLeft, this.handleUserLeft);
  };

  @action
  handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
    //console.log('%cDiscussion:', CONSOLE_LOG_SCOPE_COLOR, 'user published', user);
    if(!this.client){
      return
    }
    await this.client.subscribe(user, mediaType);
    user.audioTrack?.play();

    this.updateRemoteUsers();
  };

  @action
  handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
    //console.log('%cDiscussion:', CONSOLE_LOG_SCOPE_COLOR, 'user unpublished', user); // eslint-disable-line no-console

    this.updateRemoteUsers();
  };

  @action
  handleUserJoined = (user: IAgoraRTCRemoteUser) => {
    //console.log('%cDiscussion:', CONSOLE_LOG_SCOPE_COLOR, 'user joined', user); // eslint-disable-line no-console

    //this.getUsers();
  };

  @action
  handleUserLeft = (user: IAgoraRTCRemoteUser) => {
    //console.log('%cDiscussion:', CONSOLE_LOG_SCOPE_COLOR, 'user left', user);

    this.idToUser.delete(user.uid);
    this.updateRemoteUsers();
  };
}

export default RoomStore;
