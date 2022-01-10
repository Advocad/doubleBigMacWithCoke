import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { PageStep } from '../../components/PageConstructor/types';
import { useStore } from '../../stores/rootStoreProvider';
import { Button, TextField } from '../../ui';
import styles from './Login.module.scss';

const Login = () => {
  const { loginUser } = useStore('userStore');
  const { changeStep } = useStore('routeStore');

  const [digits, setDigits] = useState('');
  const [password, setPassword] = useState('');

  const handleChangeStep = () => {
    changeStep(PageStep.REGISTRATION)
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
    loginUser({ digits, password }).then(() => {
      changeStep(PageStep.CONNECT);
    })
  }
};

export default observer(Login);
