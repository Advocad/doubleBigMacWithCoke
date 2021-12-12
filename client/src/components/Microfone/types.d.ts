export type MicrofoneProps = {
  isActiveMicrofone?: boolean;
  handlePressOn: () => void;
  handlePressOff: () => void;
  disabled?: boolean;
};
