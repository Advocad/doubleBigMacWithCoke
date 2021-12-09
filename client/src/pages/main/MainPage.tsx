import React, { useEffect } from 'react';
import { useStore } from '../../stores/rootStoreProvider';
import { observer } from 'mobx-react';

function MainPage() {
  const { value, sendValue, fetchData } = useStore('testStore');

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      Value From Server: {value}
      <input onChange={e => sendValue(Number(e.target.value))} />
    </div>
  );
}

const C = observer(MainPage);
export { C as MainPage };
