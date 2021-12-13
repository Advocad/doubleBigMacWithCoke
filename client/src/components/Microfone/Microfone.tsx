import React, { FC, Ref, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { Button, Icon } from '../../ui';
import { MicrofoneProps } from './types';

import styles from './Microfone.module.scss';
import { useStore } from '../../stores/rootStoreProvider';

function dragHelper() {
  return (
    <div className={styles.dragHelper}>
      <Icon className={styles.lock} name="lock" />
    </div>
  );
}

const Microfone: FC<MicrofoneProps> = ({
  disabled,
  isActiveMicrofone,
  handlePressOn,
  handlePressOff,
  handleHold,
}) => {
  const { localDbMeter } = useStore('callStore');
  const [showDragHelper, setShowDragHelper] = useState(false);
  const id = 'mic-elem';

  useEffect(() => {
    window.oncontextmenu = function (event) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    };
  }, []);

  useEffect(() => {
    const el = document.getElementById('mic-elem');
    const dbElem = document.getElementById('db');

    const handler = (db: number) => {
      if (el && dbElem) {
        if (db) {
          dbElem.innerText = `${Math.round(db * 10) / 10} db`;
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
      onMouseDown={onPressOn}
      onMouseUp={onPressOff}
      onTouchStart={onPressOn}
      onTouchEnd={onPressOff}
      onTouchEndOutside={onPressOutside}
      className={clsx(styles.btnMicrofone, { [styles.active]: isActiveMicrofone })}
      caption="Говорить"
    >
      <div className={styles.buttonText}>
        <Icon name={isActiveMicrofone ? 'microfone-active' : 'microfone'} />
        <label className={styles.decibelLabel} id="db">
          0 db
        </label>
      </div>
      <div className={clsx(styles.dragHelper, { [styles.show]: showDragHelper })}>
        <Icon className={styles.lock} name="lock" />
      </div>
    </Button>
  );

  function onPressOn() {
    handlePressOn();
    setShowDragHelper(true);
  }
  function onPressOff() {
    handlePressOff();
    setShowDragHelper(false);
  }
  function onPressOutside() {
    handleHold();
    setShowDragHelper(false);
  }
};

export default Microfone;
