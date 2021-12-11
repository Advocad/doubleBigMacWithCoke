import { Button, TextField } from '../../ui';
import styles from './Registration.module.scss';

const RegistrationPage = () => {
return (
  <div className={styles.container}>
    <div>
      <form>
        <TextField  placeholder="Код" />
        <TextField placeholder="Имя" type="name" />
        <TextField placeholder="Пароль" type="password" />
      </form>
    </div>
    <div>
      <Button fullWidth className={styles.btnColor}>Зарегистрировать</Button>
      <div className={styles.text}>если у вас есть аккаунта</div>
      <Button fullWidth>Вход</Button>
    </div>
  </div>
)
};

export default RegistrationPage;