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
    peerIsTalking,
    toggleHold,
    isConnectedToPeer,
    isOnHold,
    hangup,
    turnMicOn,
    turnMicOff,
  } = useStore('callStore');

  const [isMicActive, setMicActive] = useState(false);

  useEffect(() => {
    if (peerIsTalking) {
      setMicActive(false);
    }
  }, [peerIsTalking]);

  return (
    <div className={styles.container}>
      <div>
        <Listener isVoice={peerIsTalking} loading={isConnectingToPeer} />
        <div className={styles.user}>
          {peerInfo && (
            <>
              <div>{peerInfo?.nickname}</div>
              <div className={styles.number}>#{peerInfo?.digits}</div>
            </>
          )}
        </div>
      </div>
      <div className={styles.constrols}>
        <Button 
          className={styles.btnClose} 
          onClick={hangup} 
          classNameText={styles.btnCloseText} 
          caption="Выйти" 
          classNameCaption={styles.captionClose}
        >
          <Icon name="close" />
        </Button>
        <Microfone
          disabled={!isConnectedToPeer}
          isActiveMicrofone={isMicActive || isOnHold}
          handlePressOn={handleOn}
          handlePressOff={handleOff}
        />
        <Button
          onClick={toggleHold}
          disabled={!isConnectedToPeer}
          className={clsx(styles.btnLock, { [styles.active]: isOnHold })}
          caption="Непрерывно"
          classNameCaption={styles.captionLock}
        >
          <Icon name="lock" />
        </Button>
      </div>
    </div>
  );

  function handleOn() {
    setMicActive(true);
    turnMicOn();
  }

  function handleOff() {
    setMicActive(false);
    turnMicOff();
  }
};

export default observer(CallPage);
