import React, { useContext, createContext } from 'react';
import CallStore from './CallStore/CallStore';
import UserStore from './UserStore/UserStore';
import SnakbarStore from './SnakbarStore/SnackbarStore';
import RouteStore from './RouteStore/RouteStore';

type Stores = {
  callStore: CallStore;
  userStore: UserStore;
  snackbarStore: SnakbarStore;
  routeStore: RouteStore
};

function initStores(rootStore: RootStore) {
  return {
    callStore: new CallStore(rootStore),
    userStore: new UserStore(rootStore),
    snackbarStore: new SnakbarStore(),
    routeStore: new RouteStore(),
  };
}

export class RootStore {
  constructor() {
    this.stores = initStores(this);
  }

  stores: Stores;

  public resetAppState() {
    this.stores = initStores(this);
  }
}

const rootStoreContext = createContext<RootStore | null>(null);

export function useStore<T extends keyof Stores>(store: T) {
  const context = useContext(rootStoreContext);
  if (context) {
    return context.stores[store];
  }
  throw Error('Store is not provided!');
}

export const RootStoreProvider: React.FC = ({ children }) => {
  return <rootStoreContext.Provider value={new RootStore()}>{children}</rootStoreContext.Provider>;
};
