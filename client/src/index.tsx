import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { RootStoreProvider } from './stores/rootStoreProvider';
import Snackbar from './components/Snackbar';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <RootStoreProvider>
        <App />
        <Snackbar />
      </RootStoreProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
