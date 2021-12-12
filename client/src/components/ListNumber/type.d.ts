type NumbersType = {
  nickname: string;
  digits: string;
};

export type ListNumberProps = {
  numbers: NumbersType[];
  onAddNumber: (code) => void;
};
