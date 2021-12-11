

export type ButtonProps = {
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  classNameText?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  fullWidth?: boolean;
  value?: string;
}