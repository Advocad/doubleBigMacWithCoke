import React, { useEffect, useState } from 'react';
import { useStore } from '../../stores/rootStoreProvider';
import { observer } from 'mobx-react';

function MainPage() {
  const { addBurger, fetchBurgers, burgerList } = useStore('burgerStore');

  const [price, setPrice] = useState<number | null>(null);
  const [title, setTitle] = useState<string | null>(null);

  useEffect(() => {
    fetchBurgers();
  }, [fetchBurgers]);

  return (
    <div>
      <div>
        <label>Burger name</label>
        <input onChange={e => setTitle(e.target.value)}></input>
      </div>
      <div>
        <label>Burger price</label>
        <input onChange={e => setPrice(Number(e.target.value))}></input>
      </div>
      <button onClick={add}>Добавить бургер</button>
      <div>
        <h2>Список бургеров</h2>
        {burgerList.map(item => (
          <div>
            название: {item.title} цена: {item.price}{' '}
          </div>
        ))}
      </div>
    </div>
  );

  function add() {
    if (price && title) {
      addBurger({ price, title });
    }
  }
}

const C = observer(MainPage);
export { C as MainPage };
