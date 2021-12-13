import { observer } from 'mobx-react';
import { useCallback, useMemo, useState } from 'react';
import { IncomingCall, ListNumber, NumBoard } from '../../components';
import { useStore } from '../../stores/rootStoreProvider';
import { Button, Icon, TextField } from '../../ui';
import styles from './Connect.module.scss';
import clsx from 'clsx';

const ConnectPage = () => {
  const { user, recentCalls, logout } = useStore('userStore');
  const { incomingCall, peerInfo, connectToPeerByDigits, handleIncomingCall, isJanusConnected } =
    useStore('callStore');

  const [isNumLock, setIsNumLock] = useState(false);
  const [number, setNumber] = useState('');

  const handleLock = useCallback(() => {
    setIsNumLock(true);
  }, []);

  const onChangeNumber = useCallback(
    value => {
      if (number.length + 1 <= 4) setNumber(number + value);
    },
    [number]
  );

  const handleRemoveNumber = useCallback(() => {
    setNumber(number.slice(0, -1));
    if (number.length === 1) {
      setIsNumLock(false);
    }
  }, [number]);

  const handleAddNumber = useCallback(code => {
    setNumber(String(code));
  }, []);

  const handleConnection = useCallback(() => {
    if (number.length === 4) connectToPeerByDigits(number);
    else {
    }
  }, [number, connectToPeerByDigits]);

  const renderBuutton = useMemo(() => {
    if (isNumLock) {
      return (
        <>
          <NumBoard OnChangeNumber={onChangeNumber} OnRemoveNumber={handleRemoveNumber} />
          <Button
            // disabled={number.length !== 4}
            disabled={number.length !== 4}
            className={styles.btnPhone}
            onClick={handleConnection}
          >
            <Icon name="phone" />
          </Button>
        </>
      );
    }

    return (
      <>
        <Button onClick={handleLock} className={styles.btnNumber}>
          <Icon name="numericBoard" />
        </Button>
      </>
    );
  }, [handleLock, handleRemoveNumber, handleConnection, number, isNumLock, onChangeNumber]);

  return (
    <div className={styles.container}>
      <div className={styles.logout} onClick={logout}>
        <span>Logout</span>
        <Icon name="setting" className={styles.iconSetting} />
      </div>
      <div className={styles.topBlock}>
        <div className={styles.user}>
          <span className={styles.name}>{user?.nickname}</span>
          <div
            className={clsx(styles.status, {
              [styles.connecting]: !isJanusConnected,
              [styles.online]: isJanusConnected,
            })}
          />
        </div>
        <div className={clsx(styles.user, styles.userNumber)}>#{user?.digits}</div>
        <TextField
          placeholder="Набрать цифры"
          onFocus={() => setIsNumLock(true)}
          onChange={e => setNumber(e)}
          value={number}
          maxLength={4}
          className={styles.fieldNumber}
        />
        {recentCalls.length > 0 && (
          <ListNumber
            numbers={recentCalls}
            onAddNumber={code => {
              handleAddNumber(code);
              setIsNumLock(true);
            }}
          />
        )}
      </div>
      <div className={styles.bottom}>{renderBuutton}</div>
      {incomingCall && peerInfo && (
        <IncomingCall
          digits={peerInfo?.digits}
          nickname={peerInfo?.nickname}
          handleClick={handleIncomingCall}
        />
      )}
    </div>
  );
};

export default observer(ConnectPage);
