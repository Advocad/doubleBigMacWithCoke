import { RootStore } from '../rootStoreProvider';
import { observable, action, makeObservable, computed } from 'mobx';
import axios, { Axios } from 'axios';
import shortid from 'shortid';
import JanusApi, { janusUrl } from './JanusApi';
import JanusSocketApi from './JanusSocketApi';
// import * as Janus from 'janus-typescript-client'

const ICE_SERVERS = [
  { urls: 'stun:videos-webrtc.dev.avalab.io/restapi' },
  // { urls: 'stun:videos-webrtc.dev.avalab.io/restapi', credential: 'as', username: 'asd' },
];

export default class JanusStore {
  constructor(private rootStore: RootStore) {
    makeObservable(this);
  }

  private janusApi: JanusApi = new JanusApi(this.rootStore);
  private janusSocketApi: JanusSocketApi = new JanusSocketApi();
  private peerConnection: RTCPeerConnection | null = null;
  public analyzer: AnalyserNode | null = null;
  public localStream: MediaStream | null = null;
  public remoteStream: MediaStream = new MediaStream();

  @observable
  private sessionId: number | null = null;
  @observable
  private handle_id: number | null = null;

  @observable states = {
    isSessionCreating: false,
    isAttachingPlugins: false,
    isUserRegistering: false,
  };

  private eventHandler = (data: JanusEvents) => {};

  @action.bound
  public setEventHandler(handler: (data: JanusEvents) => void) {
    this.eventHandler = handler;
  }

  @action.bound
  async makeLocalStream() {
    const localstream = await navigator.mediaDevices.getUserMedia({ audio: true });

    localstream.getTracks().forEach(track => {
      this.peerConnection?.addTrack(track, localstream);
    });

    this.localStream = localstream;
  }
  @computed
  public get isLoading() {
    return !Object.values(this.states).every(i => i === false);
  }

  @action.bound
  handleRemotePeer(answer: RTCSessionDescriptionInit) {
    this.peerConnection?.setRemoteDescription(new RTCSessionDescription(answer));
  }

  @action.bound
  async createSession() {
    this.states.isSessionCreating = true;
    const { data } = await this.janusSocketApi.createSession();
    this.sessionId = data.id;
    this.states.isSessionCreating = false;
  }

  @action.bound
  async attachPlugin() {
    if (!this.sessionId) throw new Error('Session ID is none');

    this.states.isAttachingPlugins = true;
    const {
      data: { id },
    } = await this.janusSocketApi.attachPlugin(this.sessionId);
    this.states.isAttachingPlugins = false;

    this.handle_id = id;
  }

  @action preConnect = async () => {
    // this.makePeerConnection();
    // this.makeLocalStream();

    await this.janusSocketApi.awaitSocketConnected();
    await this.createSession();
    await this.attachPlugin();

    this.janusSocketApi.subscribeToEvents(this.handleEvents);
  };

  @action.bound
  async registerUser(name: string) {
    if (!this.sessionId || !this.handle_id) {
      throw new Error('Cant register; No session');
    }

    return await this.janusSocketApi.registerUser(this.sessionId, this.handle_id, name);
  }

  @action.bound
  connect(name: string) {
    if (!this.peerConnection) return;

    this.peerConnection.createOffer({ offerToReceiveAudio: true }).then(e => {
      this.janusApi.sendOffer({ sdp: e.sdp || '', username: name });
      this.peerConnection && this.peerConnection.setLocalDescription(e);
    });
  }

  @action.bound
  sendOffer(username: string, sdp: string) {
    if (!this.sessionId || !this.handle_id) {
      throw new Error('Cant senOffer; No session');
    }

    return this.janusSocketApi.sendOffer({
      sdp,
      username,
      session_id: this.sessionId,
      handle_id: this.handle_id,
    });
  }

  @action.bound
  play() {
    if (!this.remoteStream) {
      throw new Error('Stream remote is not defined');
    }

    const ctx = new AudioContext();
    const mic = ctx.createMediaStreamSource(this.remoteStream);
    mic.connect(ctx.destination);
  }

  @action.bound
  async accept(offer: { sdp: string }) {
    this.peerConnection?.setRemoteDescription(
      new RTCSessionDescription({ type: 'offer', sdp: offer.sdp })
    );

    const result = await this.peerConnection?.createAnswer();
    result && this.janusApi.sendAccept({ sdp: result.sdp || '' });
  }

  @action.bound
  async sendAccept(answer: RTCSessionDescriptionInit) {
    if (!this.sessionId || !this.handle_id) {
      throw new Error('Cant sendAccept; No session');
    }

    this.janusSocketApi.sendAccept({
      sdp: answer.sdp || '',
      handle_id: this.handle_id,
      session_id: this.sessionId,
    });
  }

  @action.bound
  handleEvents(data: any) {
    const transformed = this.transformEventData(data);
    transformed && this.eventHandler(transformed);
    // if (data.janus === 'event') {
    //   const incomingEvent = data?.plugindata?.data?.result;
    //   if (incomingEvent?.event === 'incomingcall') {
    //     this.accept(data?.jsep);
    //   }

    //   if (incomingEvent?.event === 'accepted' && data?.jsep) {
    //     this.peerConnection?.setRemoteDescription({ type: 'answer', sdp: data?.jsep.sdp });
    //     // this.remoteStream =
    //   }
    // }
  }

  public transformEventData(data: any): JanusEvents | null {
    const result = data?.plugindata?.data?.result;

    if (result?.event === 'incomingcall') {
      return {
        event: 'incoming_call',
        data: {
          peername: result.username as string,
          type: data.jsep.type as 'offer',
          sdp: data.jsep.sdp as string,
        },
      };
    }

    if (data?.jsep?.type === 'answer') {
      return {
        event: 'answer',
        data: {
          type: 'answer',
          sdp: data.jsep.sdp as string,
        },
      };
    }

    return null;
  }

  @action sendICECandidate = (candidate: RTCIceCandidate) => {
    if (!this.sessionId || !this.handle_id) {
      throw new Error('Cant send ticke; No session');
    }

    this.janusSocketApi.sendICECandidate({
      candidate: candidate.candidate,
      sdpMLineIndex: candidate.sdpMLineIndex || 0,
      sdpMid: candidate.sdpMid || '',
      handle_id: this.handle_id,
      session_id: this.sessionId,
    });
  };

  @action sendICECompleted = () => {
    if (!this.sessionId || !this.handle_id) {
      throw new Error('Cant send ticke; No session');
    }

    this.janusSocketApi.sendICECompleted({ session_id: this.sessionId, handle_id: this.handle_id });
  };

  // @action
  // public initAudio = () => {
  //   const audioContext = new AudioContext();
  //   const e = this.remoteStream;
  //   const spe = audioContext.createAnalyser();

  //   const mic = audioContext.createMediaStreamSource(e);

  //   spe.smoothingTimeConstant = 0.8;
  //   spe.fftSize = 1024;

  //   const bufferLength = spe.frequencyBinCount;
  //   const dataArray = new Uint8Array(bufferLength);

  //   mic.connect(spe);

  //   this.analyzer = spe;
  //   function draw() {
  //     requestAnimationFrame(draw);

  //     spe.getByteFrequencyData(dataArray);
  //     const sum = dataArray.reduce((prev, cur) => prev + cur, 0) / dataArray.length;
  //     console.log(sum);
  //   }

  //   draw();
  // };
}

export type JanusEvents =
  | {
      event: 'incoming_call';
      data: {
        peername: string;
        type: 'offer';
        sdp: string;
      };
    }
  | {
      event: 'answer';
      data: {
        type: 'answer';
        sdp: string;
      };
    };
