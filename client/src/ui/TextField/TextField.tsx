import { ChangeEvent, FC } from 'react';
import { TextFieldProps } from './type';

import styles from './TextField.module.scss';

const TextField: FC<TextFieldProps> = ({
  type,
  placeholder,
  className,
  onChange,
  value,
  ...props
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    return onChange && onChange(e.target.value);
  };

  return (
    <div className={styles.textField}>
      <input
        className={className}
        type={type}
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
