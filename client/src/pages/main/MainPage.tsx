
import { observer } from 'mobx-react';
import {Button} from '../../ui';

import styles from './Main.module.scss';
import Logo from './shared/Logo/Logo';

function MainPage() {
  return (
    <div className={styles.container}>
      <div>
        <Logo />
        <div className={styles.description}>Могу брякнуть человеку, он подскочит, обрисуй ему ситуевинку, порешаете по ходу</div>
      </div>
      <Button>Продолжить</Button>
    </div>
  );
}

const C = observer(MainPage);
export { C as MainPage };
