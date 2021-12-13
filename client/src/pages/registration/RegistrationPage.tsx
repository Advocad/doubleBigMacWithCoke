import { useState } from 'react';
import { useStore } from '../../stores/rootStoreProvider';
import { Button, TextField } from '../../ui';
import styles from './Registration.module.scss';

const RegistrationPage = () => {
  const { registerUser, toggleForm } = useStore('userStore');
  const [digits, setDigits] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleDigits = (digits: string) => {
    if (digits.length > 4) return;

    setDigits(digits);
  };

  const handleSignup = () => {
    registerUser({ digits, password, nickname: name });
    handleChangeStep();
  };

  const handleChangeStep = () => {
    toggleForm(false);
  };

  return (
    <div className={styles.container}>
      <div>
        <form>
          <TextField placeholder="Код" value={digits} onChange={handleDigits} />
          <TextField placeholder="Имя" type="name" value={name} onChange={setName} />
          <TextField placeholder="Пароль" type="password" value={password} onChange={setPassword} />
        </form>
      </div>
      <div>
        <Button fullWidth className={styles.btnColor} onClick={handleSignup}>
          Зарегистрировать
        </Button>
        <Button fullWidth onClick={handleChangeStep}>
          Вход
        </Button>
      </div>
    </div>
  );
};

export default RegistrationPage;
