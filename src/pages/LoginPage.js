import React from 'react';
import Login from '../components/Auth/Login';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();

  return <Login onLogin={login} />;
};

export default LoginPage;
