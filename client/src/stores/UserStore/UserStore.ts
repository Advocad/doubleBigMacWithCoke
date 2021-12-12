import { RootStore } from '../rootStoreProvider';
import { observable, action, makeObservable, computed } from 'mobx';
import axios, { Axios } from 'axios';

type User = {
  id: string;
  digits: number;
  nickname: string;
};

export default class UserStore {
  constructor(private rootStore: RootStore) {
    makeObservable(this);

    this.http = axios.create({
      baseURL: '/',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  private http: Axios;

  @observable user: User | null = null;
  @observable error: string | null = null;
  @observable isUserLoginning = true;
  @observable hasVisited = false;

  @computed
  get isUserLogged() {
    return !!this.user;
  }

  @action.bound
  public setUser(user: User) {
    this.user = user;
  }

  @action.bound
  public async checkLocalStoreAndLogIfNeeded() {
    this.isUserLoginning = true;

    const id = localStorage.getItem('userId');
    const hasVisited = localStorage.getItem('hasVisited');

    if (id) {
      const res = await this.getUser({ id });
      console.log(res);
      this.setUser(res.data);
    }

    if (hasVisited) {
      this.hasVisited = true;
    }

    localStorage.setItem('hasVisited', '1');
    this.isUserLoginning = false;
  }

  @action.bound
  public setHasVisited() {
    this.hasVisited = true;
    localStorage.setItem('hasVisited', '1');
  }

  @action.bound
  public async loginUser(credentials: { digits: string; password: string }) {
    const answer = await this.http.post('/login', credentials);

    if (answer.data.type === 'error') {
      this.error = 'UserNotFound';

      this.rootStore.stores.snackbarStore.pushMessage({ text: this.error });
    } else {
      this.user = answer.data.data;

      localStorage.setItem('userId', answer.data.data.id);
    }
  }

  @action.bound
  public async getUser(user: { id?: string; digits?: string }) {
    const answer = await this.http.post('/user', user);

    return answer.data;
  }

  @action.bound
  public async registerUser(user: { digits: string; nickname: string; password: string }) {
    const answer = await this.http.post('/register', user);

    if (answer.data.type === 'error') {
      this.error = answer.data.error;
    } else {
      this.user = answer.data.data;
    }
  }
}
