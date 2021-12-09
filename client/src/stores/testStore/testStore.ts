import { observable, action, computed, makeObservable } from 'mobx';
import axios, { Axios } from 'axios';
import { io, Socket } from 'socket.io-client';
import AgoraRTC, { IAgoraRTCClient, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';

import { RootStore } from '../rootStoreProvider';

export default class TestStore {
  constructor(private rootStore: RootStore) {
    this.agora = AgoraRTC.createClient({ codec: 'av1', mode: 'rtc' });
    this.socket = io('/');
    this.http = axios.create({
      baseURL: '/',
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json',
      },
    });
    makeObservable(this);
  }

  private agora: IAgoraRTCClient;
  private socket: Socket;
  private http: Axios;
  public localAudioTrack: IMicrophoneAudioTrack | null = null;

  @observable
  public appId: string | null = null;

  @observable
  private _testValue: number = 0;

  @computed
  public get canCall() {
    return !!this.appId;
  }

  @action
  public createTrack = async () => {
    this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  };

  @action
  public setValue = (value: number) => {
    this._testValue = value;
  };

  @action
  public call = async (isPublisher: boolean, channel: string) => {
    const { uid, token } = await this.getToken(isPublisher, channel);
    await this.createTrack();

    if (!this.appId) {
      return;
    }

    await this.agora.join(this.appId, channel, token, uid);
    this.agora.on('user-published', async (user, mediaType) => {
      // Subscribe to the remote user when the SDK triggers the "user-published" event
      await this.agora.subscribe(user, mediaType);
      console.log('subscribe success');

      // If the remote user publishes an audio track.
      if (mediaType === 'audio') {
        // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
        const remoteAudioTrack = user.audioTrack;
        // Play the remote audio track.
        remoteAudioTrack?.play();
      }

      // Listen for the "user-unpublished" event
      this.agora.on('user-unpublished', user => {
        // Unsubscribe from the tracks of the remote user.
        this.agora.unsubscribe(user);
      });
    });
  };

  @action leave = () => {
    this.localAudioTrack?.close();
    this.agora.leave();
  };

  @action sendValue = async (value: number) => {
    const res = await this.http.post('/api', JSON.stringify({ value }));
    this.setValue(res.data.value);
    this.socket.emit('test', { e: 1231 });
  };

  @action getToken = async (isPublisher: boolean, channel: string) => {
    const res = await this.http.post('/rtctoken', JSON.stringify({ isPublisher, channel }));

    return { uid: res.data.uid, token: res.data.token } as { uid: number; token: string };
  };

  @action
  public fetchData = async () => {
    const req = axios.create({ baseURL: '/' });

    try {
      const res = await req.get('/appid');
      this.setValue(Number(res.data.message));
    } catch (e) {
      console.log(e);
    }
  };

  @computed
  public get value() {
    return this._testValue;
  }
}
