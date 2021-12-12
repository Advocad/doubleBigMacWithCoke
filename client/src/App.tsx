import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { CallPage, ConnectPage, LoadingPage, Login, RegistrationPage } from './pages';
import { MainPage } from './pages/main/MainPage';
import { useStore } from './stores/rootStoreProvider';

function App() {
  const { isUserLogged, hasVisited, user, isRegistration, isUserLoginning, checkLocalStoreAndLogIfNeeded } =
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
    return <LoadingPage />;
  }

  if (!hasVisited) {
    return <MainPage />;
  }

  if(isRegistration) {
    return <RegistrationPage />;
  }

  if (!isUserLogged) {
    return <Login />;
  }

  return <ConnectPage />;
}

export default observer(App);
