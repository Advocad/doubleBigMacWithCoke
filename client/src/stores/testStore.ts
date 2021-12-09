import { RootStore } from './rootStoreProvider';
import { observable, action, computed, makeObservable } from 'mobx';

export default class TestStore {
  constructor(private rootStore: RootStore) {
    makeObservable(this);
  }

  @observable
  private _testValue: number = 0;

  @action
  public setValue = (value: number) => {
    this._testValue = value;
  };

  @computed
  public get value() {
    return this._testValue * 100;
  }
}
