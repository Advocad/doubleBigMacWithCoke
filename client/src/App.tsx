import React from 'react';
import { Routes, Route } from 'react-router';
import { CallPage } from './pages';

function App() {
  return (
    <Routes>
      <Route path="/" element={<CallPage />}></Route>
    </Routes>
  );
}

export default App;
