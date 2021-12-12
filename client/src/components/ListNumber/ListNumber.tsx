import { FC, useMemo } from 'react';
import { ListNumberProps } from './type';

import styles from './ListNumber.module.scss';

const ListNumber: FC<ListNumberProps> = ({ numbers }) => {
  const renderList = useMemo(() => {
    return numbers.map(number => {
      return (
        <div className={styles.number}>
          <div>{number.name}</div>
          <div>{number.code}</div>
        </div>
      );
    });
  }, [numbers]);

  return <div className={styles.block}>{renderList}</div>;
};

export default ListNumber;
