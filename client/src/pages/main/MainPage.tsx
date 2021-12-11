import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../../stores/rootStoreProvider';
import { observer } from 'mobx-react';
import Janus from 'janus-gateway-js';
import style from './style.module.scss';

// function Decibel() {
//   const { init, analyzer } = useStore('janusStore');

//   useEffect(() => {
//     if (analyzer) {
//       // console.log("INMIT")

//       init();
//       const elem = document.getElementById('analyzer');
//       const spe = analyzer;

//       const bufferLength = spe.frequencyBinCount;
//       const dataArray = new Uint8Array(bufferLength);

//       const draw = () => {
//         requestAnimationFrame(draw);

//         spe.getByteFrequencyData(dataArray);

//         let sum = dataArray.reduce((prev, cur) => prev + cur, 0) / dataArray.length;

//         sum = Math.round(sum * 10) / 2;

//         if (elem) {
//           elem.innerHTML = `${sum}`;
//           elem.style.background = `rgb(${Math.round(sum)}, 40, 40`;
//         }
//       };

//       draw();
//     }
//   }, [analyzer, init]);

//   return (
//     <div>
//       <div className={style.analyzer} id="analyzer"></div>
//     </div>
//   );
// }

// const Deci = observer(Decibel);

// function MainPage() {
//   const { init } = useStore('janusStore');
//   const [start, setStart] = useState(false);

//   useEffect(() => {
//     console.log('INIT');
//     init();
//   }, [init]);

//   return (
//     <div>
//       {start && <Deci />}
//       <div></div>
//       <canvas id="oscilloscope"></canvas>
//       <button onClick={() => setStart(true)}>SetSTart</button>
//     </div>
//   );
// }

function MainPage() {
  return <div>Main</div>;
}

const C = observer(MainPage);
export { C as MainPage };
