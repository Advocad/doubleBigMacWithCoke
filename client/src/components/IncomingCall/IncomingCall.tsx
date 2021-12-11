import styles from './IncomingCall.module.scss';

const IncomingCall = () => {
  return (
    <div className={styles.pulse}>
      <div className={styles.text}>
        <div>#1488</div>
        <div>Артем</div>
      </div>
    </div>
  )
};

export default IncomingCall;