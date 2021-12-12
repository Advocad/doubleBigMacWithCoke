import React, { useEffect, useState } from 'react';
import { useStore } from '../../stores/rootStoreProvider';
import { observer } from 'mobx-react';
import style from './style.module.scss';

function LoginPage() {
  const { isUserLogged, user, loginUser, error } = useStore('userStore');
  const [digits, setDigits] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      {isUserLogged && loggedLayout()}
      {!isUserLogged && notLoggedLayout()}
    </div>
  );

  function loggedLayout() {
    if (!user) return null;

    return (
      <div>
        <span>{user.digits}</span>
        <span>{user.id}</span>
        <span>{user.nickname}</span>
      </div>
    );
  }

  function notLoggedLayout() {
    return (
      <div>
        Войти
        <div>
          <label htmlFor="">Name</label>
          <input type="text" value={digits} onChange={e => setDigits(e.target.value)} />
          <label htmlFor="">Password</label>
          <input type="text" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={() => loginUser({ digits, password })}>Login</button>
        </div>
        {error && <div>{error}</div>}
      </div>
    );
  }
}

const C = observer(LoginPage);
export { C as LoginPage };
