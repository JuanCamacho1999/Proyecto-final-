// src/pages/RoleRedirect.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role'); // Obtener el rol del usuario desde localStorage

    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'receptionist') {
      navigate('/receptionist');
    } else if (role === 'customer') {
      navigate('/customer');
    } else if (role === 'cashier') {
      navigate('/cashier');
    } else {
      navigate('/login'); // Redirigir al login si no hay rol
    }
  }, [navigate]);

  return null; // No renderiza nada, solo redirige
};

export default RoleRedirect;
