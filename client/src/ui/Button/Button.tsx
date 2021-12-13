import { FC, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { ButtonProps } from './type';
import styles from './Button.module.scss';

function useOutsideAlerter(ref: any, onClickOutside?: () => void | undefined) {
  const [hasClick, setHasClick] = useState(false);

  useEffect(() => {
    if (!onClickOutside) return;

    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (hasClick && ref.current && !ref.current.contains(event.target)) {
        onClickOutside && onClickOutside();
        setHasClick(false);
      }
    }

    function handleClickBegin() {
      setHasClick(true);
    }

    // Bind the event listener
    ref.current && ref.current.addEventListener('mousedown', handleClickBegin);
    ref.current && ref.current.addEventListener('touchstart', handleClickBegin);

    document.addEventListener('mouseup', handleClickOutside);
    document.addEventListener('touchend', handleClickOutside);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mouseup', handleClickOutside);
      document.removeEventListener('touchend', handleClickOutside);

      ref.current && ref.current.removeEventListener('mousedown', handleClickBegin);
      ref.current && ref.current.removeEventListener('touchstart', handleClickBegin);
    };
  }, [ref, onClickOutside, hasClick]);
}

const Button: FC<ButtonProps> = ({
  children,
  id,
  disabled,
  onMouseDown,
  onMouseUp,
  onTouchStart,
  onTouchEnd,
  onTouchEndOutside,
  onClick,
  className,
  classNameText,
  classNameCaption,
  value,
  fullWidth,
  caption,
  ...props
}) => {
  const ref = useRef(null);

  useOutsideAlerter(ref, onTouchEndOutside);

  return (
    <>
      <button
        id={id}
        ref={ref}
        className={clsx(styles.btn, { [styles.fullWidth]: fullWidth }, className)}
        disabled={disabled}
        onClick={onClick}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
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
