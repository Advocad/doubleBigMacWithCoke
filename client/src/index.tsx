import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { RootStoreProvider } from './stores/rootStoreProvider';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <RootStoreProvider>
        <App />
      </RootStoreProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
