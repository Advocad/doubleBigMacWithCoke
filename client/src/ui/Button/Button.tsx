import { FC } from 'react';
import clsx from 'clsx';

import { ButtonProps } from './type';
import styles from './Button.module.scss';

const Button: FC<ButtonProps> = ({
  children,
  id,
  disabled,
  onMouseDown,
  onTouchEnd,
  onTouchStart,
  onMouseUp,
  onClick,
  className,
  classNameText,
  classNameCaption,
  value,
  fullWidth,
  caption,
  ...props
}) => {
  return (
    <>
      <button
        id={id}
        className={clsx(styles.btn, { [styles.fullWidth]: fullWidth }, className)}
        disabled={disabled}
        onClick={onClick}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        value={value}
        {...props}
      >
        <div className={clsx(styles.buttonText, classNameText)}>{children}</div>
      </button>

      {caption && <div className={clsx(styles.caption, classNameCaption)}>{caption}</div>}
    </>
  );
};

export default Button;
