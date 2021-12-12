import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router';
import { CallPage, ConnectPage, Login } from './pages';
import { MainPage } from './pages/main/MainPage';
import { useStore } from './stores/rootStoreProvider';

function App() {
  const { isUserLogged, hasVisited, user, isUserLoginning, checkLocalStoreAndLogIfNeeded } =
    useStore('userStore');

  const { initJanusConnection, isConnectedToPeer, isConnectingToPeer, isJanusConnected } =
    useStore('callStore');

  useEffect(() => {
    if (user && !isJanusConnected) {
      initJanusConnection(String(user.id));
    }
  }, [user, initJanusConnection, isJanusConnected]);

  useEffect(() => {
    checkLocalStoreAndLogIfNeeded();
  }, []);

  if (isConnectedToPeer || isConnectingToPeer) {
    return <CallPage />;
  }

  if (isUserLoginning) {
    return <div>Loginning...</div>;
  }

  if (!hasVisited) {
    return <MainPage />;
  }

  if (!isUserLogged) {
    return <Login />;
  }

  return <ConnectPage />;
}

export default observer(App);
