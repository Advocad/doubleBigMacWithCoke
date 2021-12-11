import React from 'react';
import { Routes, Route } from 'react-router';
import { MainPage } from './pages';
import { CallPage } from './pages/call/CallPage';

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<MainPage />}></Route> */}
      <Route path="/" element={<CallPage />}></Route>
    </Routes>
  );
}

export default App;
