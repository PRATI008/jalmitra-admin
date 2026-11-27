import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Users from './Pages/Users';
import Supplier from './Pages/Supplier';
import Subscription from './Pages/Subscription';
import Orders from './Pages/Orders';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/user' element={<Users />} />
        <Route path='/supplier' element={<Supplier />} />
        <Route path='/subscription' element={<Subscription />} />
        <Route path='*' element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
