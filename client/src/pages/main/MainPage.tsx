import { observer } from 'mobx-react';
import { PageStep } from '../../components/PageConstructor/types';
import { useStore } from '../../stores/rootStoreProvider';
import { Button } from '../../ui';

import styles from './Main.module.scss';
import Logo from './shared/Logo/Logo';

function MainPage() {
  const { changeStep } = useStore('routeStore');

  const handleChangePage = () => {
    changeStep(PageStep.LOGIN)
  }
  
  return (
    <div className={styles.container}>
      <div>
        <Logo />
        <div className={styles.description}>
          Могу брякнуть человеку, он подскочит, обрисуй ему ситуевинку, порешаете по ходу
        </div>
      </div>
      <Button onClick={handleChangePage}>Продолжить</Button>
    </div>
  );
}

const C = observer(MainPage);
export { C as MainPage };
