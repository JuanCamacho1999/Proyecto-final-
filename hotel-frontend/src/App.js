// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import AdminPage from './Pages/AdminPage';
import ReceptionistPage from './Pages/ReceptionistPage';
import CustomerPage from './Pages/CustomerPage';
import CashierPage from './Pages/CashierPage';
import RoleRedirect from './Pages/RoleRedirect'; // Componente que maneja la redirección

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/role-redirect" element={<RoleRedirect />} /> {/* Redirige a la página correcta */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/receptionist" element={<ReceptionistPage />} />
        <Route path="/customer" element={<CustomerPage />} />
        <Route path="/cashier" element={<CashierPage />} />
      </Routes>
    </Router>
  );
};

export default App;




