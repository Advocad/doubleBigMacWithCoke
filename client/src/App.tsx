import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router';
import { CallPage } from './pages';
import { useStore } from './stores/rootStoreProvider';

function App() {
  const { isUserLogged, isUserLoginning, checkLocalStoreAndLogIfNeeded } = useStore('userStore');

  useEffect(() => {
    checkLocalStoreAndLogIfNeeded();
  }, []);

  if (isUserLoginning) {
    return <div>Loginning...</div>;
  }

  if (!isUserLogged) {
    return <div>LOGIN PAGE</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<CallPage />}></Route>
    </Routes>
  );
}

export default observer(App);
