import { ChangeEvent, FC } from 'react';
import { TextFieldProps } from './type';

import styles from './TextField.module.scss';

const TextField: FC<TextFieldProps> = ({
  type,
  placeholder,
  className,
  onChange,
  onFocus,
  value,
  maxLength,
  ...props
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (maxLength && e.target.value.length > maxLength) return;
    return onChange && onChange(e.target.value);
  };

  return (
    <div className={styles.textField}>
      <input
        className={className}
        type={type}
        onFocus={onFocus}
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
        {...props}
      />
    </div>
  );
};

TextField.defaultProps = {
  type: 'text',
};

export default TextField;
