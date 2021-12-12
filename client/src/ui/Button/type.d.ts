export type ButtonProps = {
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  classNameText?: string;
  onMouseDown?: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLElement>) => void;
  onTouchStart?: (e: React.TouchEvent<HTMLElement>) => void;
  onTouchEnd?: (e: React.TouchEvent<HTMLElement>) => void;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  fullWidth?: boolean;
  value?: string;
};
