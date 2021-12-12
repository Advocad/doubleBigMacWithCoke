import React, { useEffect, useState } from 'react';
import { useStore } from '../../stores/rootStoreProvider';
import { observer } from 'mobx-react';
import style from './style.module.scss';

function CallPage() {
  const {
    initJanusConnection,
    connectToPeerByDigits,
    error,
    incomingCall,
    handleIncomingCall,
    isConnectedToPeer,
    isJanusConnected,
    hangup,
  } = useStore('callStore');

  const { user } = useStore('userStore');

  const [peerName, setPeerName] = useState('');

  useEffect(() => {
    user && initJanusConnection(user.id);
  }, [user, initJanusConnection]);

  if (!user) return null;

  return (
    <div>
      <h2>My number: {user.digits}</h2>
      {isJanusConnected && (
        <div>
          <h3>We connected to janus</h3>
          <h2>Connect to peer</h2>

          {!isConnectedToPeer && (
            <div>
              <input type="text" onChange={e => setPeerName(e.target.value)} />
              <button disabled={!peerName} onClick={() => connectToPeerByDigits(peerName)}>
                Connect to Peer
              </button>
            </div>
          )}
        </div>
      )}

      {isConnectedToPeer && <div>Connected To peer. Now talk</div>}
      {error}
      {!!incomingCall && (
        <div>
          INCOMING CALL
          <button onClick={() => handleIncomingCall(true)}>Accept</button>
          <button onClick={() => handleIncomingCall(false)}>Decline</button>
        </div>
      )}
      {isConnectedToPeer && <button onClick={hangup}> Повесить трубу</button>}
    </div>
  );
}
// function CallPage() {
//   const { connect, preConnect, registerUser, play, makeLocalStream, initAudio, isLoading } =
//     useStore('janusStore');
//   const [name, setName] = useState('');
//   const [connectTo, setConnectTo] = useState('');

//   useEffect(() => {
//     preConnect();
//   }, []);
//   return (
//     <div>
//       <button onClick={play}>Play</button>
//       {/* <button onClick={play}>MakeLocalStream</button> */}
//       <div>IsLoading: {isLoading ? 'True' : 'False'}</div>
//       <div>
//         <input type="text" onChange={e => setName(e.target.value)} />
//         <button onClick={() => registerUser(name)}>REgister user</button>
//       </div>

//       <input onChange={e => setConnectTo(e.target.value)}></input>
//       <button onClick={() => connect(connectTo)}>Connect</button>
//       <button onClick={() => makeLocalStream()}>Make stream</button>
//       <button onClick={initAudio}>Audio console</button>
//       {/* <button onClick={createSession}>CreateSession</button>
//       <button onClick={attachPlugin}>AttachPlugin</button>
//       <button onClick={enableAudio}>EnableAudio</button>
//       <button onClick={subscribeToPlugin}>subscribeToPlugin</button>
//       <button onClick={peerConnection}>peerConnection</button>
//   <button onClick={createJanus}>createJanus</button> */}
//     </div>
//   );
// }

const C = observer(CallPage);
export { C as CallPage };
