import { Listener, Microfone } from '../../components';
import { Button, Icon } from '../../ui';
import styles from './Call.module.scss';

const CallPage = () => {
  return (
    <div className={styles.container}>
      <div>
        <Listener />
        <div className={styles.user}>
          <div>Лёха</div>
          <div className={styles.number}>#1448</div>
        </div>
      </div>
      <div className={styles.constrols}>
        <Button className={styles.btnClose} classNameText={styles.btnCloseText}>
          <Icon name="close" />
        </Button>
        <Microfone />
      </div>
    </div>
  );
};

export default CallPage;
