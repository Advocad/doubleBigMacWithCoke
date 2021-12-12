import { FC } from "react";
import clsx from 'clsx';

import { Icon } from "../../ui";
import Loading from "../Loading";

import styles from './Listener.module.scss';
import { ListenerProps } from "./types";

const Listener: FC<ListenerProps> = ({loading, isVoice}) => {
  return (
    <div className={clsx(styles.circle, {[styles.pulse]: isVoice} )}>
      {loading ? <Loading /> : <Icon name="hog" />}
    </div>
  )
}

export default Listener;