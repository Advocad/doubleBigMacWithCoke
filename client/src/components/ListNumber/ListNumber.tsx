import { FC, useCallback, useMemo } from 'react';
import { ListNumberProps } from './type';

import styles from './ListNumber.module.scss';

const ListNumber: FC<ListNumberProps> = ({ numbers, onAddNumber }) => {
  const handlePasteField = useCallback(
    digits => () => {
      onAddNumber(digits);
    },
    [onAddNumber]
  );

  const renderList = useMemo(() => {
    return numbers.map(number => {
      return (
        <div
          className={styles.number}
          key={number.digits}
          onClick={handlePasteField(number.digits)}
        >
          <div>{number.nickname}</div>
          <div>{number.digits}</div>
        </div>
      );
    });
  }, [handlePasteField, numbers]);

  return (
    <div className={styles.block}>
      <div className={styles.text}>Недавние созвоны</div>
      {renderList}
    </div>
  );
};

export default ListNumber;
