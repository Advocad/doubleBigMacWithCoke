import { useCallback, useMemo, useState } from 'react';
import { IncomingCall, ListNumber, NumBoard } from '../../components';
import { Button, Icon, TextField } from '../../ui';
import styles from './Connect.module.scss';

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
          <Button className={styles.btnPhone}>
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
        <div className={styles.user}>Пользователь #12355</div>
        <TextField placeholder="Цифры" value={number} />
        <ListNumber numbers={array} />
      </div>
      <div className={styles.bottom}>{renderBuutton}</div>
      <IncomingCall />
    </div>
  );
};

export default ConnectPage;
