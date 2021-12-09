import React, { useContext, createContext } from 'react';
import TestStore from './testStore';

type Stores = {
  testStore: TestStore;
};

function initStores(rootStore: RootStore) {
  return {
    testStore: new TestStore(rootStore),
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
