import { ChangeEvent, useState } from 'react';
import { useStore } from '../../stores/rootStoreProvider';
import { observer } from 'mobx-react';

function MainPage() {
  const { init, join, leave } = useStore('roomStore');
  const [nameRoom, setNameRoom] = useState('');
  const [isRoom, setIsRoom] = useState(false);

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setNameRoom(e.target.value)
  }

  const renderRoom = () => { 
    if(isRoom) {
      return <div>{nameRoom}</div>
    }

    return (
      <div>
        <div>Название комнаты</div>
        <input onChange={handleChangeName} />
      </div>
    )
  }

  const joinToRoom = async () => {
    setIsRoom(true)
    await init({ userName: 'alex', nameRoom});
    await join();
  };

  const leaveToRoom = () => {
    setIsRoom(false)
    leave()
  };


  return (
    <div>
      {renderRoom()}
      <button onClick={joinToRoom}>Подключиться</button>
      <button onClick={leaveToRoom}>Выйти</button>
    </div>
  );
}

const C = observer(MainPage);
export { C as MainPage };
