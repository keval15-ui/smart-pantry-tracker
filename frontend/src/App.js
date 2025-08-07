import React, { useState } from 'react';
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

  const [pantryItems, setPantryItems] = useState([]);
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

  // Handle login
  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setCurrentView('dashboard');
    setCurrentUser(userData);
    console.log('User logged in:', userData);
  };

  // Handle signup
  const handleSignup = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setCurrentView('dashboard');
    setCurrentUser(userData);
    console.log('User signed up:', userData);
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentUser(null);
    setCurrentView('login');
  };

  // Switch views
  const switchToSignup = () => {
    setCurrentView('signup');
  };

  const switchToLogin = () => {
    setCurrentView('login');
  };

  // Add pantry item
  const handleAddItem = (item) => {
    setPantryItems([...pantryItems, item]);
  };

  // Update user profile
  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    setUser(updatedUser);
    console.log('User updated:', updatedUser);
  };

  // Show dashboard if authenticated
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

  // Show login or signup page if not authenticated
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