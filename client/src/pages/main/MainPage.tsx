import React from 'react';
import { useStore } from '../../stores/rootStoreProvider';
import { observer } from 'mobx-react';

function MainPage() {
  const { value, setValue } = useStore('testStore');
  return (
    <div>
      MainPage {value}
      <input onChange={e => setValue(Number(e.target.value))} />
    </div>
  );
}

const C = observer(MainPage);
export { C as MainPage };
