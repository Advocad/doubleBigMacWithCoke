import { useState } from 'react';
import { useStore } from '../../stores/rootStoreProvider';
import { Button, TextField } from '../../ui';
import styles from './Login.module.scss';

const Login = () => {
  const { loginUser } = useStore('userStore');

  const [digits, setDigits] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className={styles.container}>
      <div>
        <form>
          <TextField placeholder="Код" value={digits} onChange={handleDigits} />
          <TextField placeholder="Пароль" type="password" value={password} onChange={setPassword} />
        </form>
      </div>
      <div>
        <Button fullWidth className={styles.btnColor} onClick={handleSignup}>
          Войти
        </Button>
        <div className={styles.text}>если у вас нет аккаунта</div>
        <Button fullWidth>Регистрация</Button>
      </div>
    </div>
  );

  function handleDigits(digits: string) {
    // if (!/^\d+$/.test(digits)) {
    //   setDigits('');

    //   return;
    // }

    if (digits.length > 4) return;

    setDigits(digits);
  }

  function handleSignup() {
    loginUser({ digits, password });
  }
};

export { Login };
