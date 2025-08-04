import React, { useState } from 'react';
import './App.css';
import Login from './components/login';
import Signup from './components/signup';
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'signup'

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    console.log('User logged in:', userData);
  };

  const handleSignup = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    console.log('User signed up:', userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView('login');
  };

  const switchToSignup = () => {
    setCurrentView('signup');
  };

  const switchToLogin = () => {
    setCurrentView('login');
  };

  // If authenticated, show dashboard
  if (isAuthenticated) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  // If not authenticated, show login or signup page
  return (
    <div className="app">
      <div className="app-container">
        {currentView === 'login' ? (
          <Login onLogin={handleLogin} onSwitchToSignup={switchToSignup} />
        ) : (
          <Signup onSignup={handleSignup} onSwitchToLogin={switchToLogin} />
        )}
      </div>
    </div>
  );
}

export default App;