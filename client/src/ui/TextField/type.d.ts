export type TextFieldProps = {
  type?: string;
  placeholder?: string;
  className?: string;
  onFocus?(): void;
  onChange?: (value: string) => void;
  value?: string;
  maxLength?: number;
};
