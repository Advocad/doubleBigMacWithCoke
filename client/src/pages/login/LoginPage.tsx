import { useState } from 'react';
import { useStore } from '../../stores/rootStoreProvider';
import { Button, TextField } from '../../ui';
import styles from './Login.module.scss';

const Login = () => {
  const { loginUser, toggleForm } = useStore('userStore');

  const [digits, setDigits] = useState('');
  const [password, setPassword] = useState('');

  const handleChangeStep = () => {
    toggleForm(true);
  };

  return (
    <div className={styles.container}>
      <div>
        <form>
          <TextField placeholder="Код" value={digits} onChange={handleDigits} />
          <TextField placeholder="Пароль" type="password" value={password} onChange={setPassword} />
          <div className={styles.recovery}>Забыли пароль ?</div>
        </form>
      </div>
      <div>
        <Button fullWidth className={styles.btnColor} onClick={handleSignup}>
          Войти
        </Button>
        <Button fullWidth onClick={handleChangeStep}>
          Регистрация
        </Button>
      </div>
    </div>
  );

  function handleDigits(digits: string) {
    if (digits.length > 4) return;

    setDigits(digits);
  }

  function handleSignup() {
    loginUser({ digits, password });
  }
};

export { Login };
