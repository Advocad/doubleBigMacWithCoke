import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { Listener, Microfone } from '../../components';
import { useStore } from '../../stores/rootStoreProvider';
import { Button, Icon } from '../../ui';
import styles from './Call.module.scss';

const CallPage = () => {
  const {
    isConnectingToPeer,
    peerInfo,
    isConnectedToPeer,
    isOnHold,
    hangup,
    soundState,
    setOnHold,
    resetHold,
  } = useStore('callStore');

  const [lockActive, setLockActive] = useState(false);

  useEffect(() => {
    if (lockActive && !isOnHold) {
      setLockActive(false);
    }
  }, [isOnHold, lockActive, setLockActive]);
  return (
    <div className={styles.container}>
      <div>
        <Listener isVoice={soundState === 'recieving'} loading={isConnectingToPeer} />
        <div className={styles.user}>
          {isConnectingToPeer && (
            <>
              <div className={styles.name}>{peerInfo?.nickname}</div>
              <div className={styles.digits}>#{peerInfo?.digits}</div>
            </>
          )}
        </div>
      </div>
      <div className={styles.constrols}>
        <Button className={styles.btnClose} onClick={hangup} classNameText={styles.btnCloseText}>
          <Icon name="close" />
        </Button>
        <Microfone
          disabled={!isConnectedToPeer}
          isActiveMicrofone={soundState === 'sending'}
          handlePressOn={handleOn}
          handlePressOff={handleOff}
        />
        <Button
          onClick={handleLock}
          disabled={!isConnectedToPeer}
          className={clsx(styles.btnLock, { [styles.active]: lockActive })}
        >
          <Icon name="lock" />
        </Button>
      </div>
    </div>
  );

  function handleOn() {
    setOnHold();
  }

  function handleOff() {
    resetHold();
  }

  function handleLock() {
    if (lockActive) {
      setLockActive(false);

      resetHold();
    } else {
      setLockActive(true);
      setOnHold();
    }
  }
};

export default observer(CallPage);
