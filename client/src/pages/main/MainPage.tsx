import React, { useEffect } from 'react';
import { useStore } from '../../stores/rootStoreProvider';
import { observer } from 'mobx-react';

function MainPage() {
  const { value, call, leave, sendValue, fetchData } = useStore('testStore');

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const channel = 'CHANEL';
  return (
    <div>
      <button onClick={() => call(true, channel)}>Join</button>
      <button onClick={leave}>Leave</button>
      Value From Server: {value}
      <input onChange={e => sendValue(Number(e.target.value))} />
    </div>
  );
}

const C = observer(MainPage);
export { C as MainPage };
