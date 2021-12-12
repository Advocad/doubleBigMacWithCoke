import { FC, useEffect, useState } from "react";
import clsx from 'clsx';

import styles from './Snackbar.module.scss';
import { SnackbarProps } from "./types";

const Snackbar: FC<SnackbarProps> = ({message}) => {
  const [isActive, setIsActive] = useState<boolean>(true);

  console.log(isActive);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(false)
    }, 2500);
    return () => clearTimeout(timer);
  }, [])

  return (
    <div className={clsx(styles.snackbar, {[styles.show]: isActive})}>
      {message}
    </div>
  )
};

export default Snackbar;