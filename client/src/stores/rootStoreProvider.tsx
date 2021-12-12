import React, { useContext, createContext } from 'react';
import CallStore from './CallStore/CallStore';
import UserStore from './UserStore/UserStore';

type Stores = {
  callStore: CallStore;
  userStore: UserStore;
};

function initStores(rootStore: RootStore) {
  return {
    callStore: new CallStore(rootStore),
    userStore: new UserStore(rootStore),
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
