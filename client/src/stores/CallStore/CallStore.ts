import { RootStore } from '../rootStoreProvider';
import { observable, action, makeObservable } from 'mobx';
import JanusStore, { JanusEvents } from '../JanusStore/JanusStore';

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
  }

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
  public peer: string | null = null;

  @observable
  public isConnectedToPeer = false;

  @observable
  public isJanusConnected = false;

  @observable
  public isSoundActive = false;

  @observable
  public incomingCall: { peername: string; type: 'offer'; sdp: string } | null = null;

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
    // const bufferLength = spe.frequencyBinCount;
    // const dataArray = new Uint8Array(bufferLength);

    mic.connect(ctx.destination);
    // function draw() {
    //   requestAnimationFrame(draw);

    //   console.log(dataArray);
    // }

    // draw();
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

      return;
    }

    this.connectToPeer(result.data.id);
  }

  @action.bound
  public async connectToPeer(peerName: string) {
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
  public handleEvents(e: JanusEvents) {
    if (e.event === 'incoming_call') {
      this.incomingCall = e.data;
    }
    if (e.event === 'answer') {
      this.handleAnswer(e.data);
    }
    if (e.event === 'hangup') {
      this.hangup();
    }
    if (e.event === 'error') {
      if (e.data.code === 476) {
        throw new Error('Alreay registered');
      }
    }
  }

  @action.bound
  public hangup() {
    this.peerConnection.close();

    this.resetState();
  }

  @action.bound
  public resetState() {
    this.peer = null;
    this.isConnectedToPeer = false;

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