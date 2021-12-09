import { RootStore } from '../rootStoreProvider';
import { observable, action, computed, makeObservable } from 'mobx';
import axios, { Axios } from 'axios';
import { io, Socket } from 'socket.io-client';

export default class TestStore {
  constructor(private rootStore: RootStore) {
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

  private socket: Socket;
  private http: Axios;

  @observable
  private _testValue: number = 0;

  @action
  public setValue = (value: number) => {
    this._testValue = value;
  };

  @action sendValue = async (value: number) => {
    const res = await this.http.post('/api', JSON.stringify({ value }));
    this.setValue(res.data.value);
    this.socket.emit('test', { e: 1231 });
  };

  @action
  public fetchData = async () => {
    const req = axios.create({ baseURL: '/' });
    try {
      const res = await req.get('/api');
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
