import { Button, TextField } from '../../ui';
import styles from './Login.module.scss';

const RegistrationPage = () => {
return (
  <div className={styles.container}>
    <div>
      <form>
        <TextField  placeholder="Код" />
        <TextField placeholder="Пароль" type="password" />
      </form>
    </div>
    <div>
      <Button fullWidth className={styles.btnColor}>Войти</Button>
      <div className={styles.text}>если у вас нет аккаунта</div>
      <Button fullWidth>Регистрация</Button>
    </div>
  </div>
)
};

export default RegistrationPage;