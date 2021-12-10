import React, { useContext, createContext } from 'react';
import BurgerStore from './burgerStore/BurgerStore';
import TestStore from './testStore/testStore';

type Stores = {
  testStore: TestStore;
  burgerStore: BurgerStore;
};

function initStores(rootStore: RootStore) {
  return {
    testStore: new TestStore(rootStore),
    burgerStore: new BurgerStore(rootStore),
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
