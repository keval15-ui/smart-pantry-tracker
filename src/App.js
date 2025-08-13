import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login.jsx';
import Signup from './components/Auth/Signup.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import './styles/global.css';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (savedUser && token) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      // Mock authentication
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: credentials.email
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', mockToken);
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return { success: true, user: mockUser };
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const signup = async (userData) => {
    try {
      // Mock registration
      const mockUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', mockToken);
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return { success: true, user: mockUser };
    } catch (error) {
      throw new Error('Signup failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: '#f7fafc'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login onLogin={login} />
              )
            } 
          />
          <Route 
            path="/signup" 
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Signup onSignup={signup} />
              )
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? (
                <Dashboard user={user} onLogout={logout} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/" 
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
            } 
          />
          <Route 
            path="*" 
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
            } 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;