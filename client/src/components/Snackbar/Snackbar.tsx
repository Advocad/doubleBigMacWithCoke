import { FC } from 'react';
import clsx from 'clsx';

import styles from './Snackbar.module.scss';
import { useStore } from '../../stores/rootStoreProvider';
import { observer } from 'mobx-react';

const Snackbar: FC = () => {
  const { message } = useStore('snackbarStore');

  return <div className={clsx(styles.snackbar, { [styles.show]: !!message })}>{message?.text}</div>;
};

export default observer(Snackbar);
