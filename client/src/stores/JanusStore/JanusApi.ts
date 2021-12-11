import { RootStore } from '../rootStoreProvider';
import { observable, action, makeObservable } from 'mobx';
import axios, { Axios } from 'axios';
import shortid from 'shortid';
// import * as Janus from 'janus-typescript-client'

const pluginAudio = 'janus.plugin.videocall';

export const janusUrl = 'https://videos-webrtc.dev.avalab.io/restapi';

export default class JanusApi {
  constructor(private rootStore: RootStore) {
    this.http = axios.create({
      baseURL: janusUrl,
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json',
      },
    });

    makeObservable(this);
  }

  private http: Axios;
  public sessionId: number | null = null;
  public pluginId: number | null = null;

  public analyzer: AnalyserNode | null = null;

  @action.bound
  async createSession() {
    const result = await this.http.post('/', {
      janus: 'create',
      transaction: shortid(),
    });

    console.log(result.data.data.id);
    this.sessionId = result.data.data.id;
  }

  @action.bound
  async subscribeToPlugin(onData: (e: any) => void) {
    const longPoll = async () => {
      const res = await this.http.get(`/${this.sessionId}`);
      onData(res.data);

      if (!this.sessionId) return;

      longPoll();
    };

    longPoll();
  }

  @action.bound
  async sendOffer(offer: { username: string; sdp: string }) {
    const { sdp, username } = offer;

    const data = {
      janus: 'message',
      body: { request: 'call', username },
      transaction: shortid(),
      jsep: {
        type: 'offer',
        sdp,
      },
      session_id: this.sessionId,
      handle_id: this.pluginId,
    };

    const result = await this.http.post(`/${this.sessionId}/${this.pluginId}`, data);
    console.log('RESULT OFFER', result);
  }

  @action.bound
  async sendAccept(offer: { sdp: string }) {
    const { sdp } = offer;

    const data = {
      janus: 'message',
      body: { request: 'accept' },
      transaction: shortid(),
      jsep: {
        type: 'answer',
        sdp,
      },
      session_id: this.sessionId,
      handle_id: this.pluginId,
    };

    const result = await this.http.post(`/${this.sessionId}/${this.pluginId}`, data);
    console.log('RESULT ANSWER', result);
  }

  @action.bound
  async trickle(data: { candidate: string; sdpMid: string; sdpMLineIndex: number }) {
    const result = await this.http.post(`/${this.sessionId}/${this.pluginId}`, {
      janus: 'trickle',
      candidate: data,
      transaction: shortid(),
    });

    return result;
  }

  @action.bound
  async trickleCompleted() {
    const result = await this.http.post(`/${this.sessionId}/${this.pluginId}`, {
      janus: 'trickle',
      candidate: { completed: true },
      transaction: shortid(),
    });

    return result;
  }

  @action.bound
  async registerUser(name: string) {
    if (!this.pluginId || !this.sessionId) return;

    const result = await this.http.post(`/${this.sessionId}/${this.pluginId}`, {
      janus: 'message',
      body: {
        request: 'register',
        username: name,
      },
      transaction: shortid(),
    });

    console.log('User Registered', result.data);
  }

  @action.bound
  async attachPlugin() {
    if (!this.sessionId) return;

    const result = await this.http.post(`/${this.sessionId}`, {
      janus: 'attach',
      plugin: pluginAudio,
      transaction: shortid(),
      sessionId: this.sessionId,
    });

    this.pluginId = result.data.data.id;
    console.log('Enable audio', result.data);
  }
}
