import { RootStore } from '../rootStoreProvider';
import { observable, action, makeObservable, computed } from 'mobx';
import JanusSocketApi from './JanusSocketApi';

const ACK_INTERVAL = 20000;
export default class JanusStore {
  constructor(private rootStore: RootStore) {
    makeObservable(this);
  }

  private janusSocketApi: JanusSocketApi = new JanusSocketApi();
  // public analyzer: AnalyserNode | null = null;
  // public localStream: MediaStream | null = null;
  // public remoteStream: MediaStream = new MediaStream();

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
  ackHandler: number | null = null;

  @action.bound
  public setEventHandler(handler: (data: JanusEvents) => void) {
    this.eventHandler = handler;
  }

  @computed
  public get isLoading() {
    return !Object.values(this.states).every(i => i === false);
  }

  @action.bound
  spamAckByTimeout() {
    this.ackHandler = window.setInterval(() => {
      if (!this.sessionId) {
        this.ackHandler && window.clearInterval(this.ackHandler);
        this.ackHandler = null;

        return;
      }

      this.janusSocketApi.sendAck(this.sessionId);
    }, ACK_INTERVAL);
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
    await this.janusSocketApi.awaitSocketConnected();
    await this.createSession();
    this.spamAckByTimeout();
    await this.attachPlugin();

    this.janusSocketApi.subscribeToEvents(this.handleEvents);
  };

  @action.bound
  async registerUser(name: string) {
    if (!this.sessionId || !this.handle_id) {
      throw new Error('Cant register; No session');
    }

    const result = await this.janusSocketApi.registerUser(this.sessionId, this.handle_id, name);

    const errorCode = result.plugindata.data;
    console.log('ErrorCode', errorCode);
    if (result.plugindata.data.error_code && result.plugindata.data.error_code === 476) {
      throw new Error('Cannot register user, may be have another logged in');
    }
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
  }

  public transformEventData(data: any): JanusEvents | null {
    const result = data?.plugindata?.data?.result;

    if (data?.plugindata?.data?.error_code) {
      return {
        event: 'error',
        data: {
          code: data?.plugindata?.data?.error_code,
          message: data?.plugindata?.data?.error,
        },
      };
    }

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

    if (result?.event === 'hangup') {
      return {
        event: 'hangup',
        data: {
          reason: result.reason,
        },
      };
    }

    if (result?.event === 'incomingcall' || data.janus === 'hangup') {
      return {
        event: 'hangup',
        data: {
          reason: 'yes',
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
    }
  | {
      event: 'hangup';
      data: {
        reason: string;
      };
    }
  | {
      event: 'error';
      data: {
        message: string;
        code: number;
      };
    };
