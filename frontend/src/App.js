import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/login';
import Signup from './components/signup';
import Dashboard from './components/Dashboard';
import ScanItem from './components/Scanitem';
import Profile from './components/Profile';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'signup'

  const [pantryItems, setPantryItems] = useState([
    // ... existing pantry items
  ]);

  const [shoppingList, setShoppingList] = useState([
    { id: 1, item: 'Milk', checked: false },
    { id: 2, item: 'Eggs', checked: false }
  ]);

  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('expiry');
  const [showProfile, setShowProfile] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

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

  const handleAddItem = (item) => {
    setPantryItems([...pantryItems, item]);
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    console.log('User updated:', updatedUser);
  };

  // If authenticated, show dashboard
  if (isAuthenticated) {
    return (
      <Dashboard 
        user={user} 
        onLogout={handleLogout} 
        pantryItems={pantryItems}
        shoppingList={shoppingList}
        filterCategory={filterCategory}
        sortBy={sortBy}
        showProfile={showProfile}
        showScanner={showScanner}
        setShowProfile={setShowProfile}
        setShowScanner={setShowScanner}
        setShowProfileModal={setShowProfileModal}
        onAddItem={handleAddItem}
        onUpdateUser={handleUpdateUser}
      />
    );
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