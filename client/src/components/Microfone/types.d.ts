export type MicrofoneProps = {
  isActiveMicrofone?: boolean;
  handlePressOn: () => void;
  handleHold: () => void;
  handlePressOff: () => void;
  disabled?: boolean;
};
