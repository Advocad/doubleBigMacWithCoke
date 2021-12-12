import { FC, useEffect } from 'react';
import clsx from 'clsx';

import { Button, Icon } from '../../ui';
import { MicrofoneProps } from './types';

import styles from './Microfone.module.scss';
import { useStore } from '../../stores/rootStoreProvider';

const Microfone: FC<MicrofoneProps> = ({
  disabled,
  isActiveMicrofone,
  handlePressOn,
  handlePressOff,
}) => {
  const { localDbMeter } = useStore('callStore');

  const id = 'mic-elem';

  useEffect(() => {
    const el = document.getElementById('mic-elem');
    const dbElem = document.getElementById('db');

    const handler = (db: number) => {
      if (el && dbElem) {
        if (db) {
          console.log('DB');
          dbElem.innerText = `${Math.round(db * 10) / 10} db`;

          // const x = 1 + db / 80;
          // const y = 1 + db / 80;
          // el.style.transform = `scale(${x},  ${y})`;
        } else {
          el.style.transform = `scale(1)`;
        }
      }
    };

    if (localDbMeter) {
      localDbMeter.setRun(true);
      localDbMeter.run();
      localDbMeter.setDbHandler(handler);
    }
  }, [localDbMeter]);

  return (
    <Button
      id={id}
      disabled={disabled}
      onMouseDown={handlePressOn}
      onMouseUp={handlePressOff}
      onTouchStart={handlePressOff}
      onTouchEnd={handlePressOff}
      className={clsx(styles.btnMicrofone, { [styles.active]: isActiveMicrofone })}
      caption="Говорить"
    >
      <div className={styles.buttonText}>
        <Icon name={isActiveMicrofone ? 'microfone-active' : 'microfone'} />
        <label className={styles.decibelLabel} id="db">
          0 db
        </label>
      </div>
    </Button>
  );
};

export default Microfone;
