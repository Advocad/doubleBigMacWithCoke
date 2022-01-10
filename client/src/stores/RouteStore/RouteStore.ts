import { action, makeObservable, observable } from "mobx";
import { PageStep } from "../../components/PageConstructor/types";

export default class RouteStore {
  constructor() {
    makeObservable(this);
  }

  @observable
  public step: PageStep = (localStorage.getItem('step') as PageStep) || PageStep.BASE;

  @action.bound
  public changeStep(step: PageStep) {
    this.setStep(step);
    localStorage.setItem('step', step);
  }

  @action.bound
  private setStep(step: PageStep) {
    this.step = step;
  }
} 