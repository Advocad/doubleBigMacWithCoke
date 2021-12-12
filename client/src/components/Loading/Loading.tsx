import ReactLoading from 'react-loading';

import styles from './Loading.module.scss';

const Loading = () => {
  return <ReactLoading type="bubbles" className={styles.loading} />;
};

export default Loading;
