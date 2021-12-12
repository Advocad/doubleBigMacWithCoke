import { observer } from 'mobx-react';
import { useCallback, useMemo, useState } from 'react';
import { IncomingCall, ListNumber, NumBoard } from '../../components';
import { useStore } from '../../stores/rootStoreProvider';
import { Button, Icon, TextField } from '../../ui';
import styles from './Connect.module.scss';
import clsx from 'clsx';

const array = [
  {
    name: 'Арртем',
    code: 1234,
  },
  {
    name: 'Арртем2',
    code: 312,
  },
];

const ConnectPage = () => {
  const { user } = useStore('userStore');
  const { incomingCall, connectToPeerByDigits, handleIncomingCall, isJanusConnected } =
    useStore('callStore');

  const [isNumLock, setIsNumLock] = useState(false);
  const [number, setNumber] = useState('');

  const handleLock = useCallback(() => {
    setIsNumLock(true);
  }, []);

  const onChangeNumber = useCallback(
    value => {
      setNumber(number + value);
    },
    [number]
  );

  const renderBuutton = useMemo(() => {
    if (isNumLock) {
      return (
        <>
          <NumBoard OnChangeNumber={onChangeNumber} />
          <Button className={styles.btnPhone} onClick={() => connectToPeerByDigits(number)}>
            <Icon name="phone" />
          </Button>
        </>
      );
    }

    return (
      <>
        <Button onClick={handleLock} className={styles.btnNumber}>
          <Icon name="nuumber" />
        </Button>
        <Button className={styles.btnSetting} classNameText={styles.btnSettingText}>
          <Icon name="setting" />
        </Button>
      </>
    );
  }, [handleLock, isNumLock, onChangeNumber]);

  return (
    <div className={styles.container}>
      <div>
        <div
          className={clsx(styles.status, {
            [styles.connecting]: !isJanusConnected,
            [styles.online]: isJanusConnected,
          })}
        ></div>
        <div className={styles.user}>{user?.nickname}</div>
        <div className={styles.user}>{user?.digits}</div>
        <TextField placeholder="Цифры" value={number} />
        <ListNumber numbers={array} />
      </div>
      <div className={styles.bottom}>{renderBuutton}</div>
      {incomingCall && (
        <IncomingCall
          digits={incomingCall.peername}
          nickname="Boba"
          handleClick={handleIncomingCall}
        />
      )}
    </div>
  );
};

export default observer(ConnectPage);
