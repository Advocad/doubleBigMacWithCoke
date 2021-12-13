import { Ref } from 'react';

export type ButtonProps = {
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  classNameText?: string;
  classNameCaption?: string;
  ref?: Ref;
  id?: string;
  onMouseDown?: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLElement>) => void;
  onTouchStart?: (e: React.TouchEvent<HTMLElement>) => void;
  onTouchEnd?: (e: React.TouchEvent<HTMLElement>) => void;
  onTouchEndOutside?: () => void;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  fullWidth?: boolean;
  value?: string;
  caption?: string;
};
