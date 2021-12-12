import { observer } from 'mobx-react';
import { Listener, Microfone } from '../../components';
import { useStore } from '../../stores/rootStoreProvider';
import { Button, Icon } from '../../ui';
import styles from './Call.module.scss';

const CallPage = () => {
  const { user } = useStore('userStore');
  const { incomingCall, connectToPeerByDigits, handleIncomingCall, isJanusConnected, hangup } =
    useStore('callStore');

  return (
    <div className={styles.container}>
      <div>
        <Listener />
        <div className={styles.user}>
          <div>{'mock data'}</div>
          <div className={styles.number}>#1448</div>
        </div>
      </div>
      <div className={styles.constrols}>
        <Button className={styles.btnClose} onClick={hangup} classNameText={styles.btnCloseText}>
          <Icon name="close" />
        </Button>
        <Microfone />
      </div>
    </div>
  );
};

export default observer(CallPage);
