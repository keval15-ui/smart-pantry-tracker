import React from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>Smart Pantry</h2>
        </div>
        <div className="nav-menu">
          <ul className="nav-list">
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/inventory">Inventory</a></li>
            <li><a href="/add-item">Add Item</a></li>
            <li><a href="/reports">Reports</a></li>
          </ul>
        </div>
        <div className="nav-user">
          <span className="user-name">Hello, {user?.name}</span>
          <button onClick={logout} className="btn btn-outline btn-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
