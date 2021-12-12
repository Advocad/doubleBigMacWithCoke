import Loading from "../../components/Loading";

import styles from './Loading.module.scss';

const LoadingPage = () => {
  return(
    <div className={styles.container}> 
      <Loading />
    </div>
  )
}

export default LoadingPage;