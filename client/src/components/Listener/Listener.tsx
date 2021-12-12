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
        circleEl.current.style.transform = `scale(${db / 100}, ${db / 100})`;
      }
    };

    if (remoteDbMeter) {
      remoteDbMeter.setRun(true);
      remoteDbMeter.run();
      remoteDbMeter.setDbHandler(handler);
    }
  }, [remoteDbMeter]);

  return (
    <div ref={circleEl} className={clsx(styles.circle, { [styles.pulse]: isVoice })}>
      {loading ? <Loading /> : <Icon name="hog" />}
    </div>
  );
};

export default observer(Listener);
