import { RootStore } from '../rootStoreProvider';
import { observable, action, makeObservable } from 'mobx';
import JanusStore, { JanusEvents } from '../JanusStore/JanusStore';
import { io, Socket } from 'socket.io-client';

const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

const peerConfiguration = {
  iceServers: ICE_SERVERS,
  // Возможно эти опции ещё понадобятся
  // iceCandidatePoolSize: 10,
  // iceTransportPolicy: 'all' as const,
};

function getNewPeerConnection() {
  return new RTCPeerConnection({
    ...peerConfiguration,
    // Для гуглохрома нужная штука
    // @ts-ignore
    sdpSemantics: 'unified-plan',
  });
}

export default class CallStore {
  constructor(private rootStore: RootStore) {
    makeObservable(this);

    this.peerConnection.onconnectionstatechange = e => {
      console.log('Changed peer state', e);
    };

    this.peerConnection.onsignalingstatechange = e => {
      console.log('Signaling changed', e);
    };

    this.peerConnection.onicecandidate = ev =>
      ev.candidate && this.handleLocalFoundICE(ev.candidate);

    this.peerConnection.onicegatheringstatechange = ev => this.handleLocalICEChanged(ev);

    this.peerConnection.ontrack = ev => {
      ev.streams[0].getTracks().forEach(track => {
        this.remoteStream?.addTrack(track);

        this.activateSound();
      });
    };

    this.socket = io('/');

    this.socket.on('onvoice', e => {
      this.handleRemoteOnVoice(e);
    });
  }

  private socket: Socket;
  private janusStore: JanusStore = new JanusStore(this.rootStore);
  private peerConnection: RTCPeerConnection = getNewPeerConnection();
  private localStream: MediaStream | null = null;
  private remoteStream = new MediaStream();

  @observable states = {
    isConnectingToJanus: false,
    isAttachingPlugins: false,

    isUserRegistering: false,
  };

  @observable error = '';

  @observable
  public peerIsTalking = false;

  @observable
  public peerInfo: { digits: string; nickname: string; id: string } | null = null;

  @observable
  public isConnectedToPeer = false;

  @observable
  public isConnectingToPeer = false;

  @observable
  public isJanusConnected = false;

  @observable
  public isSoundActive = false;

  @observable
  public incomingCall: { peername: string; type: 'offer'; sdp: string } | null = null;

  @observable
  isOnHold = false;

  @action.bound
  private handleRemoteOnVoice(e: { id: string; mic: boolean }) {
    if (e.id === this.peerInfo?.id) {
      if (e.mic === true) {
        this.turnMicOff();
        this.peerIsTalking = true;

        this.remoteStream.getTracks().forEach(track => {
          track.enabled = true;
        });
      } else {
        this.peerIsTalking = false;
        if (this.isOnHold) {
          this.turnMicOn();
        }
      }
    }
  }

  @action.bound
  toggleHold() {
    this.isOnHold = !this.isOnHold;
    if (this.isOnHold && !this.peerIsTalking) {
      this.turnMicOn();
    }
    if (!this.isOnHold) {
      this.turnMicOff();
    }
  }

  @action.bound
  public async handleIncomingCall(accept = true) {
    if (!this.incomingCall) return;

    if (accept) {
      await this.initAudioAndSendTracks();

      this.peerConnection.setRemoteDescription(new RTCSessionDescription(this.incomingCall));
      const answer = await this.peerConnection.createAnswer();
      this.peerConnection.setLocalDescription(answer);
      this.janusStore.sendAccept(answer);
      this.isConnectedToPeer = true;
    }

    this.incomingCall = null;
  }

  @action.bound activateSound() {
    if (!this.remoteStream) {
      throw new Error('Stream remote is not defined');
    }

    const ctx = new AudioContext();
    const spe = ctx.createAnalyser();

    spe.smoothingTimeConstant = 0.8;
    spe.fftSize = 1024;
    const mic = ctx.createMediaStreamSource(this.remoteStream);

    this.localStream?.getAudioTracks().forEach(track => {
      track.enabled = false;
    });

    mic.connect(ctx.destination);
    this.isSoundActive = true;
  }

  @action.bound deactivateSound() {
    this.remoteStream.getTracks().forEach(track => {
      track.stop();
    });

    this.localStream?.getAudioTracks().forEach(track => {
      track.enabled = false;
    });
  }

  @action.bound
  public async initJanusConnection(username: string) {
    if (!username) {
      console.log('NO USERNAME');
      return;
    }

    console.log('Connecting to janus');
    this.states.isConnectingToJanus = true;
    await this.janusStore.preConnect();

    this.states.isConnectingToJanus = false;

    const res = await this.janusStore.registerUser(username);
    console.log('Connected to janus');
    this.isJanusConnected = true;

    this.janusStore.setEventHandler(this.handleEvents);

    console.log(res);
  }

  @action.bound
  public async handleAnswer(data: { type: 'answer'; sdp: string }) {
    this.peerConnection.setRemoteDescription(data);

    this.isConnectingToPeer = false;
    this.isConnectedToPeer = true;
  }

  @action.bound
  public async initAudioAndSendTracks() {
    const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, localStream);
    });

    this.localStream = localStream;
  }

  @action.bound
  public async connectToPeerByDigits(digits: string) {
    const result = await this.rootStore.stores.userStore.getUser({ digits });

    if (result.type === 'error') {
      this.error = result.error;
      this.rootStore.stores.snackbarStore.pushMessage({ text: result.error });

      return;
    }

    this.peerInfo = result.data;

    if (this.peerInfo?.digits && this.peerInfo?.nickname) {
      this.rootStore.stores.userStore.addRecentCall({
        digits: this.peerInfo?.digits,
        nickname: this.peerInfo?.nickname,
      });
    }

    this.connectToPeer(result.data.id);
  }

  @action.bound
  public async connectToPeer(peerName: string) {
    this.isConnectingToPeer = true;
    await this.initAudioAndSendTracks();
    const offer = await this.peerConnection.createOffer({
      offerToReceiveAudio: true,
      iceRestart: true,
    });

    this.peerConnection.setLocalDescription(offer);
    const offerResult = await this.janusStore.sendOffer(peerName, offer.sdp || '');

    this.error = offerResult.plugindata.data.error || '';
  }

  @action.bound
  private async handleIncomingOffer(data: { peername: string; type: 'offer'; sdp: string }) {
    this.incomingCall = data;

    const peer = await this.rootStore.stores.userStore.getUser({
      id: this.incomingCall.peername,
    });

    this.peerInfo = { ...peer.data, id: this.incomingCall.peername };

    if (this.peerInfo?.digits && this.peerInfo?.nickname) {
      this.rootStore.stores.userStore.addRecentCall({
        digits: this.peerInfo?.digits,
        nickname: this.peerInfo?.nickname,
      });
    }
  }

  @action.bound
  public handleEvents(e: JanusEvents) {
    if (e.event === 'incoming_call') {
      this.handleIncomingOffer(e.data);
    }
    if (e.event === 'answer') {
      this.handleAnswer(e.data);
    }
    if (e.event === 'hangup') {
      if (e.data.reason === 'User busy') {
        this.rootStore.stores.snackbarStore.pushMessage({ text: 'User is busy' });
      }

      this.hangup();
    }
    if (e.event === 'error') {
      let error = '';
      if (e.data.code === 476) {
        error = 'Alreay registered';
      }
      if (e.data.code === 478) {
        error = 'User is offline';
      }
      if (e.data.code === 479) {
        error = 'You cant call to yourself';
      }

      this.rootStore.stores.snackbarStore.pushMessage({ text: error });
      this.error = error;
    }
  }

  @action.bound
  public turnMicOn() {
    this.remoteStream.getTracks().forEach(track => {
      track.enabled = false;
    });

    this.localStream?.getTracks().forEach(track => {
      track.enabled = true;
    });

    this.peerIsTalking = false;

    const id = this.rootStore.stores.userStore.user?.id;

    this.socket.emit('onvoice', { id, mic: true });
  }

  @action.bound
  public turnMicOff() {
    const id = this.rootStore.stores.userStore.user?.id;

    this.remoteStream.getTracks().forEach(track => {
      track.enabled = true;
    });

    this.localStream?.getTracks().forEach(track => {
      track.enabled = false;
    });

    this.socket.emit('onvoice', { id, mic: false });
  }

  @action.bound
  public hangup() {
    this.peerConnection.close();

    this.resetState();
  }

  @action.bound
  public resetState() {
    this.peerInfo = null;
    this.incomingCall = null;
    this.error = '';
    this.isConnectedToPeer = false;
    this.isConnectingToPeer = false;

    this.peerConnection = getNewPeerConnection();
    this.deactivateSound();
  }

  @action.bound
  public async handleLocalFoundICE(candidate: RTCIceCandidate) {
    this.janusStore.sendICECandidate(candidate);
  }

  @action.bound
  public async handleLocalICEChanged(a: any) {
    console.log('ICE CHANGED');
    if (a.target.iceGatheringState === 'complete') {
      this.janusStore.sendICECompleted();
    }
  }
}
