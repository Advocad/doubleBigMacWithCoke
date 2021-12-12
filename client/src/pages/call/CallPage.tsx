import { observer } from 'mobx-react';
import { useState } from 'react';
import { Listener, Microfone } from '../../components';
import { useStore } from '../../stores/rootStoreProvider';
import { Button, Icon } from '../../ui';
import styles from './Call.module.scss';

const CallPage = () => {
  const { isConnectingToPeer, peerInfo, peerIsTalking, hangup, turnMicOn, turnMicOff } =
    useStore('callStore');

  const [isMicActive, setMicActive] = useState(false);

  return (
    <div className={styles.container}>
      <div>
        <Listener isVoice={peerIsTalking} loading={isConnectingToPeer} />
        <div className={styles.user}>
          {isConnectingToPeer && (
            <>
              <div>{peerInfo?.nickname}</div>
              <div className={styles.number}>#{peerInfo?.digits}</div>
            </>
          )}
        </div>
      </div>
      <div className={styles.constrols}>
        <Button className={styles.btnClose} onClick={hangup} classNameText={styles.btnCloseText}>
          <Icon name="close" />
        </Button>
        <Microfone
          isActiveMicrofone={isMicActive}
          handlePressOn={handleOn}
          handlePressOff={handleOff}
        />
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
