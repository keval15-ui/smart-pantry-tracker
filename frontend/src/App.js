import React, { useState } from 'react';
import './App.css';
import Login from './components/login';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    console.log('User logged in:', userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return (
      <div className="app">
        <div className="app-container">
          <Login onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  // If authenticated, show a simple welcome screen for now
  return (
    <div className="app">
      <div className="app-container">
        <div className="screen-container">
          <div className="card">
            <h1>Welcome to FreshTrack!</h1>
            <p>Hello, {user?.name || user?.email}!</p>
            <p>You have successfully logged in.</p>
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