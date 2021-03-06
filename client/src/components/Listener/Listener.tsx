import { FC, useEffect, useRef } from 'react';
import clsx from 'clsx';

import { observer } from 'mobx-react';
import { Icon } from '../../ui';
import Loading from '../Loading';

import styles from './Listener.module.scss';
import { ListenerProps } from './types';
import { useStore } from '../../stores/rootStoreProvider';

const Listener: FC<ListenerProps> = ({ loading, isVoice }) => {
  const { remoteDbMeter } = useStore('callStore');

  const circleEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (db: number) => {
      if (circleEl.current) {
        if (db) {
          const x = 1 + db / 100
          const y = 1 + db / 100
          circleEl.current.style.transform = `scale(${x},  ${y})`;
        } else {
          circleEl.current.style.transform = `scale(1)`;
        }
      }
    };

    if (remoteDbMeter) {
      remoteDbMeter.setRun(true);
      remoteDbMeter.run();
      remoteDbMeter.setDbHandler(handler);
    }
  }, [remoteDbMeter]);

  return (
    <div ref={circleEl} className={clsx(styles.circleDb)}>
      <div className={clsx(styles.circle, { [styles.pulse]: isVoice })}>
        {loading ? <Loading /> : <Icon name="hog" />}
      </div>
    </div>
  );
};

export default observer(Listener);
