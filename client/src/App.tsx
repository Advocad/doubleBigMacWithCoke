import React from 'react';
import { Routes, Route } from 'react-router';
import { ConnectPage, MainPage, RegistrationPage } from './pages';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ConnectPage />}></Route>
    </Routes>
  );
}

export default App;
