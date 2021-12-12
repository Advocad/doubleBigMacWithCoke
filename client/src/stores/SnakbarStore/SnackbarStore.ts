import { observable, action, makeObservable } from 'mobx';

type SnackbarMessage = {
  text: string;
};

const DEFAULT_MESSAGE_TIMEOUT = 3000;

export default class SnakbarStore {
  constructor() {
    makeObservable(this);
  }

  @observable
  public message: SnackbarMessage | null = null;

  @action.bound
  public pushMessage(message: SnackbarMessage) {
    this.setMessage(message);

    setTimeout(() => this.setMessage(null), DEFAULT_MESSAGE_TIMEOUT);
  }

  @action.bound
  private setMessage(messaage: SnackbarMessage | null) {
    this.message = messaage;
  }
}
