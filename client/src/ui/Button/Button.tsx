import { FC } from 'react';
import clsx from 'clsx';

import { ButtonProps } from './type';
import styles from './Button.module.scss';

const Button: FC<ButtonProps> = ({
  children,
  disabled,
  onMouseDown,
  onMouseUp,
  onClick,
  className,
  classNameText,
  value,
  fullWidth,
  ...props
}) => {
  return (
    <button
      className={clsx(styles.btn, { [styles.fullWidth]: fullWidth }, className)}
      disabled={disabled}
      onClick={onClick}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      value={value}
      {...props}
    >
      <div className={clsx(styles.buttonText, classNameText)}>{children}</div>
    </button>
  );
};

export default Button;
