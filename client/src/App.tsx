import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router';
import { CallPage } from './pages/call/CallPage';
// import { MainPage } from './pages';
import { LoginPage } from './pages/loginPage/LoginPage';
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
    return <LoginPage />;
  }

  return (
    <Routes>
      <Route path="/" element={<CallPage />}></Route>
      {/* <Route path="/" element={<CallPage />}></Route> */}
      {/* <Route path="/" element={<AppPage />}></Route> */}
      {/* <Route path="/login" element={<LoginPage />}></Route> */}
    </Routes>
  );
}

export default observer(App);
