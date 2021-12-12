import { FC, useCallback } from 'react';
import { Button } from '../../ui';
import { NumBoardProps } from './types';

import styles from './NumBoard.module.scss';

const NumBoard: FC<NumBoardProps> = ({ OnChangeNumber }) => {
  const keypadKeys: string[] = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '-', '0', '.'];

  const onButtonClick = useCallback(
    value => () => {
      OnChangeNumber(value);
    },
    [OnChangeNumber]
  );

  return (
    <div className={styles.container}>
      {keypadKeys.map(key => (
        <Button
          key={`button-${key}`}
          onClick={onButtonClick(key)}
          value={key}
          classNameText={styles.btnNumText}
          //disabled={!keyValid(inputValue, key)}
        >
          {key}
        </Button>
      ))}
    </div>
  );
};

export default NumBoard;
