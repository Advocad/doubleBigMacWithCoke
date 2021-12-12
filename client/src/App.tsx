import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import PageConstructor from './components/PageConstructor';
import { PageStep } from './components/PageConstructor/types';
import { useStore } from './stores/rootStoreProvider';

function App() {
  const { isUserLogged, hasVisited, user, isUserLoginning, checkLocalStoreAndLogIfNeeded } =
    useStore('userStore');

  const { step, changeStep } = useStore('routeStore');

  const { initJanusConnection, isConnectedToPeer, isConnectingToPeer, isJanusConnected } = useStore('callStore');

  useEffect(() => {
    if (user && !isJanusConnected) {
      initJanusConnection(String(user.id));
    }
  }, [user, initJanusConnection, isJanusConnected]);

  useEffect(() => {
    checkLocalStoreAndLogIfNeeded();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isUserLogged) {
      changeStep(PageStep.LOGIN);
    } else {
      changeStep(PageStep.CONNECT);
    }

    if (!hasVisited) {
      changeStep(PageStep.BASE);
    }

    if (isConnectedToPeer || isConnectingToPeer) {
      changeStep(PageStep.CALL);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (isUserLoginning) {
    return <div>Loginning...</div>;
  }

  return <PageConstructor step={step}/>;
}

export default observer(App);
