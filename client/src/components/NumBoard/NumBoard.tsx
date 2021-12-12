import { FC, useCallback } from 'react';
import { Button } from '../../ui';
import { NumBoardProps } from './types';

import styles from './NumBoard.module.scss';

const NumBoard: FC<NumBoardProps> = ({ OnChangeNumber, OnRemoveNumber }) => {
  const keypadKeys: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '<-', '0', ''];

  const onButtonClick = useCallback(
    value => () => {
      if (value === '<-') {
        return OnRemoveNumber();
      }
      OnChangeNumber(value);
    },
    [OnChangeNumber, OnRemoveNumber]
  );

  const keyValid = useCallback(key => key === '', []);

  return (
    <div className={styles.container}>
      {keypadKeys.map(key => (
        <Button
          key={`button-${key}`}
          onClick={onButtonClick(key)}
          value={key}
          classNameText={styles.btnNumText}
          disabled={keyValid(key)}
        >
          {key}
        </Button>
      ))}
    </div>
  );
};

export default NumBoard;
