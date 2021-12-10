import { RootStore } from '../rootStoreProvider';
import { observable, action, makeObservable } from 'mobx';
import axios, { Axios } from 'axios';

type Burger = {
  title: string;
  price: number;
};

export default class BurgerStore {
  constructor(private rootStore: RootStore) {
    this.http = axios.create({
      baseURL: '/',
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json',
      },
    });

    makeObservable(this);
  }

  private http: Axios;

  @observable
  public burgerList: Burger[] = [];

  @action addBurger = async (burger: Burger) => {
    await this.http.post('/burger', JSON.stringify(burger));
    this.fetchBurgers();
  };

  @action
  public fetchBurgers = async () => {
    const result = await this.http.get('/burger');

    this.burgerList = result.data as unknown as Burger[];
  };
}
