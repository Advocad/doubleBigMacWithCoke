import styles from './IncomingCall.module.scss';

type Props = { digits: string; nickname: string; handleClick: () => void };

const IncomingCall = ({ digits, nickname, handleClick }: Props) => {
  return (
    <div className={styles.pulse} onClick={handleClick}>
      <div className={styles.text}>
        <div>#{digits}</div>
        <div>${nickname}</div>
      </div>
    </div>
  );
};

export default IncomingCall;
