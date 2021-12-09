import React from 'react';
import { Routes, Route } from 'react-router';
import { MainPage } from './pages';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />}></Route>
    </Routes>
  );
}

export default App;
