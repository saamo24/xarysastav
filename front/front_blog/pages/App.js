import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
// import HomePage from './pages/HomePage'; // Example of another page

const App = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<HomePage />} /> */}
      <Route path="/login" element={<LoginPage />} />
      {/* Add more routes as needed */}
    </Routes>
  );
};

export default App;
