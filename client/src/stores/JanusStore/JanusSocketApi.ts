import { RootStore } from '../rootStoreProvider';
import { observable, action, makeObservable } from 'mobx';
import axios, { Axios } from 'axios';
import shortid from 'shortid';
// import * as Janus from 'janus-typescript-client'

function str(data: any) {
  return JSON.stringify(data);
}

const pluginAudio = 'janus.plugin.videocall';

export const janusUrl = 'wss://videos-webrtc.dev.avalab.io/websocket';

export default class JanusSocketApi {
  constructor() {
    this.socket = new WebSocket(janusUrl, 'janus-protocol');

    makeObservable(this);
  }

  private socket: WebSocket;

  @action.bound
  public async awaitSocketConnected() {
    console.log(this.socket.readyState);
    if (this.socket.readyState === 1) return;

    return new Promise(resolve => {
      const onMessage = () => {
        this.socket.removeEventListener('open', onMessage);
        console.log('CONNECTED');
        resolve(null);
      };

      this.socket.addEventListener('open', onMessage);
    });
  }

  @action.bound
  private send(data: any) {
    const transaction = shortid();
    this.socket.send(str({ ...data, transaction }));

    return transaction;
  }

  @action.bound
  private async sendRequest(data: any) {
    const transaction = this.send(data);

    return new Promise(resolve => {
      const onMessage = (message: any) => {
        const data = JSON.parse(message.data);
        if (data.janus === 'ack') return;

        if (data.transaction === transaction) {
          this.socket.removeEventListener('message', onMessage);
          resolve(data);
        }
      };

      this.socket.addEventListener('message', onMessage);
    });
  }

  @action.bound
  async createSession() {
    const response = await this.sendRequest({
      janus: 'create',
    });

    return response as SessionResponse;
  }

  @action.bound
  async attachPlugin(sessionId: number) {
    const response = await this.sendRequest({
      janus: 'attach',
      plugin: 'janus.plugin.videocall',
      opaque_id: 'videocalltest-8mtvq92i9S5i',
      session_id: sessionId,
    });

    return response as PluginResponse;
  }

  @action.bound
  async sendOffer(params: SendOfferParams) {
    const { handle_id, username, sdp, session_id } = params;
    const response = await this.sendRequest({
      janus: 'message',
      body: { request: 'call', username },
      jsep: {
        type: 'offer',
        sdp,
      },
      session_id,
      handle_id,
    });

    return response as OfferResponse;
  }

  @action.bound
  async sendAccept(params: SendAcceptParams) {
    const { handle_id, sdp, session_id } = params;

    const response = await this.sendRequest({
      janus: 'message',
      body: { request: 'accept' },
      jsep: {
        type: 'answer',
        sdp,
      },
      session_id,
      handle_id,
    });

    return response as AcceptResponse;
  }

  @action.bound
  async registerUser(session_id: number, handle_id: number, username: string) {
    const response = await this.sendRequest({
      janus: 'message',
      body: { request: 'register', username },
      session_id,
      handle_id,
    });

    return response as RegisterUserResponse;
  }

  @action.bound
  async sendICECandidate(params: SendICECandidateParams) {
    const response = await this.sendRequest({
      janus: 'trickle',
      ...params,
    });

    return response as RegisterUserResponse;
  }

  @action.bound
  async sendICECompleted(params: SendICECompletedParams) {
    const response = await this.sendRequest({
      janus: 'trickle',
      ...params,
      candidate: { completed: true },
    });

    return response as RegisterUserResponse;
  }

  @action.bound
  subscribeToEvents(handler: (a: any) => void) {
    this.socket.addEventListener('message', (message: any) => {
      handler(JSON.parse(message.data));
    });
  }
}

type SendICECompletedParams = {
  session_id: number;
  handle_id: number;
};

type SendICECandidateParams = {
  session_id: number;
  handle_id: number;
  candidate: string;
  sdpMLineIndex: number;
  sdpMid: string;
};

type SendOfferParams = {
  session_id: number;
  handle_id: number;
  username: string;
  sdp: string;
};

type SendAcceptParams = {
  session_id: number;
  handle_id: number;
  sdp: string;
};

type AcceptResponse = {};

type OfferResponse = {
  janus: 'event';
  session_id: number;
  transaction: string;
  sender: number;
  plugindata: {
    plugin: 'janus.plugin.videocall';
    data: {
      videocall: 'event';
      event?: 'calling';
      error_code?: number;
      error?: string;
    };
  };
};

type SessionResponse = {
  janus: string;
  data: {
    id: number;
  };
};

type PluginResponse = {
  janus: string;
  session_id: number;
  transaction: string;
  data: {
    id: number;
  };
};

type RegisterUserResponse = {
  janus: 'event';
  session_id: number;
  transaction: string;
  sender: number;
  plugindata: {
    plugin: 'janus.plugin.videocall';
    data: {
      videocall: 'event';
      result: {
        event: 'registered';
        username: string;
      };
    };
  };
};
