import { FC } from "react";
import clsx from 'clsx';

import { Button, Icon } from "../../ui"
import { MicrofoneProps } from "./types";

import styles from './Microfone.module.scss';

const Microfone: FC<MicrofoneProps> = ({isActiveMicrofone}) => {
  return (
    <Button className={clsx(styles.btnMicrofone, {[styles.active]: isActiveMicrofone})}>
      <Icon name={isActiveMicrofone ? "microfone-active" : 'microfone'}/>
    </Button>
  )
}

export default Microfone;