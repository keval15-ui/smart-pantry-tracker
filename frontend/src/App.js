import React, { useState } from 'react';
import './App.css';
import Login from './components/login';
import Signup from './components/signup';

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

  // If not authenticated, show login or signup page
  if (!isAuthenticated) {
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

  // If authenticated, show welcome screen
  return (
    <div className="app">
      <div className="app-container">
        <div className="screen-container">
          <div className="card">
            <h1>Welcome to FreshTrack!</h1>
            <p>Hello, {user?.name || user?.email}!</p>
            <p>You have successfully {user?.firstName ? 'signed up' : 'logged in'}.</p>
            <button className="button-primary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;