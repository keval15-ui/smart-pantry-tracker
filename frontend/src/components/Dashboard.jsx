import React, { useState, useEffect } from 'react';
import ScanItem from './Scanitem';
import Profile from './Profile';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [pantryItems, setPantryItems] = useState([
    {
      id: 1,
      name: 'Milk',
      quantity: 1,
      expiryDate: '2024-01-15',
      category: 'Dairy',
      daysUntilExpiry: 2
    },
    {
      id: 2,
      name: 'Bread',
      quantity: 1,
      expiryDate: '2024-01-18',
      category: 'Bakery',
      daysUntilExpiry: 5
    },
    {
      id: 3,
      name: 'Tomatoes',
      quantity: 3,
      expiryDate: '2024-01-20',
      category: 'Produce',
      daysUntilExpiry: 7
    },
    {
      id: 4,
      name: 'Canned Beans',
      quantity: 2,
      expiryDate: '2024-06-15',
      category: 'Canned',
      daysUntilExpiry: 150
    }
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

  // Calculate dashboard stats
  const expiringItems = pantryItems.filter(item => item.daysUntilExpiry <= 7);
  const lowStockItems = pantryItems.filter(item => item.quantity <= 2);
  const totalItems = pantryItems.length;
  const moneySaved = 25; // Mock data

  const categories = ['All', ...new Set(pantryItems.map(item => item.category))];

  const filteredItems = pantryItems
    .filter(item => filterCategory === 'All' || item.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'expiry') return a.daysUntilExpiry - b.daysUntilExpiry;
      if (sortBy === 'quantity') return a.quantity - b.quantity;
      return a.name.localeCompare(b.name);
    });

  const addToShoppingList = (itemName) => {
    const newItem = {
      id: Date.now(),
      item: itemName,
      checked: false
    };
    setShoppingList([...shoppingList, newItem]);
  };

  const toggleShoppingItem = (id) => {
    setShoppingList(shoppingList.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleAddItem = (newItem) => {
    setPantryItems([...pantryItems, newItem]);
    console.log('New item added:', newItem);
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    console.log('User updated:', updatedUser);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="app-logo-small">
            <div className="logo-icon-small">🥬</div>
            <h1 className="app-name-small">FreshTrack</h1>
          </div>
        </div>

        <div className="header-actions">
          <button 
            className="action-btn primary"
            onClick={() => setShowScanner(true)}
          >
            <span className="btn-icon">📱</span>
            Scan Item
          </button>
          <button className="action-btn secondary">
            <span className="btn-icon">🎤</span>
            Voice Search
          </button>
          
          <div className="user-profile" onClick={() => setShowProfile(!showProfile)}>
            <div className="avatar">
              {currentUser?.profileImage ? (
                <img src={currentUser.profileImage} alt="Profile" className="avatar-img" />
              ) : (
                currentUser?.name?.charAt(0) || currentUser?.email?.charAt(0) || 'U'
              )}
            </div>
            <span className="user-name">{currentUser?.name || currentUser?.email}</span>
            <span className="dropdown-arrow">▼</span>
            
            {showProfile && (
              <div className="profile-dropdown">
                <button className="dropdown-item">Settings</button>
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowProfile(false);
                  }}
                >
                  Profile
                </button>
                <hr className="dropdown-divider" />
                <button className="dropdown-item logout" onClick={onLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card alert">
          <div className="card-icon">⚠️</div>
          <div className="card-content">
            <h3>{expiringItems.length}</h3>
            <p>Items Expiring Soon</p>
          </div>
          <button className="card-action" onClick={() => setFilterCategory('All')}>
            View All
          </button>
        </div>

        <div className="summary-card warning">
          <div className="card-icon">📦</div>
          <div className="card-content">
            <h3>{lowStockItems.length}</h3>
            <p>Low Stock Items</p>
          </div>
          <button className="card-action" onClick={() => lowStockItems.forEach(item => addToShoppingList(item.name))}>
            Add to List
          </button>
        </div>

        <div className="summary-card info">
          <div className="card-icon">🏠</div>
          <div className="card-content">
            <h3>{totalItems}</h3>
            <p>Total Items</p>
          </div>
        </div>

        <div className="summary-card success">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>${moneySaved}</h3>
            <p>Money Saved</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Main Content */}
        <div className="main-content">
          <div className="pantry-section">
            <div className="section-header">
              <h2>Pantry Overview</h2>
              <div className="controls">
                <select 
                  value={filterCategory} 
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="filter-select"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="expiry">Sort by Expiry</option>
                  <option value="quantity">Sort by Quantity</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>
            </div>

            <div className="pantry-table">
              <div className="table-header">
                <div className="col-name">Item Name</div>
                <div className="col-quantity">Quantity</div>
                <div className="col-expiry">Expiry Date</div>
                <div className="col-category">Category</div>
                <div className="col-actions">Actions</div>
              </div>
              
              {filteredItems.map(item => (
                <div key={item.id} className={`table-row ${item.daysUntilExpiry <= 3 ? 'expiring-soon' : ''}`}>
                  <div className="col-name">
                    <span className="item-name">{item.name}</span>
                    {item.daysUntilExpiry <= 7 && (
                      <span className="expiry-badge">
                        {item.daysUntilExpiry <= 3 ? 'Expires Soon!' : 'Use This Week'}
                      </span>
                    )}
                  </div>
                  <div className="col-quantity">
                    <span className={`quantity ${item.quantity <= 2 ? 'low-stock' : ''}`}>
                      {item.quantity}
                    </span>
                  </div>
                  <div className="col-expiry">{item.expiryDate}</div>
                  <div className="col-category">
                    <span className="category-tag">{item.category}</span>
                  </div>
                  <div className="col-actions">
                    <button className="action-btn-small edit">Edit</button>
                    <button className="action-btn-small delete">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            <div className="chart-card">
              <h3>Expiry Timeline</h3>
              <div className="expiry-chart">
                <div className="chart-bar this-week">
                  <div className="bar-fill" style={{height: `${(expiringItems.length / totalItems) * 100}%`}}></div>
                  <span className="bar-label">This Week</span>
                  <span className="bar-value">{expiringItems.length}</span>
                </div>
                <div className="chart-bar this-month">
                  <div className="bar-fill" style={{height: '60%'}}></div>
                  <span className="bar-label">This Month</span>
                  <span className="bar-value">8</span>
                </div>
                <div className="chart-bar next-month">
                  <div className="bar-fill" style={{height: '40%'}}></div>
                  <span className="bar-label">Next Month</span>
                  <span className="bar-value">5</span>
                </div>
              </div>
            </div>

            <div className="chart-card">
              <h3>Category Distribution</h3>
              <div className="category-chart">
                {categories.filter(cat => cat !== 'All').map((category, index) => {
                  const count = pantryItems.filter(item => item.category === category).length;
                  const percentage = ((count / totalItems) * 100).toFixed(1);
                  return (
                    <div key={category} className="category-item">
                      <div className="category-color" style={{backgroundColor: `hsl(${index * 60}, 70%, 60%)`}}></div>
                      <span className="category-name">{category}</span>
                      <span className="category-percentage">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Shopping List Sidebar */}
        <div className="shopping-sidebar">
          <div className="shopping-list-card">
            <div className="list-header">
              <h3>Shopping List</h3>
              <button className="share-btn">Share</button>
            </div>

            <div className="add-item-form">
              <input 
                type="text" 
                placeholder="Add item to list..."
                className="add-item-input"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    addToShoppingList(e.target.value.trim());
                    e.target.value = '';
                  }
                }}
              />
              <button className="add-btn">+</button>
            </div>

            <div className="shopping-items">
              {shoppingList.map(item => (
                <div key={item.id} className={`shopping-item ${item.checked ? 'checked' : ''}`}>
                  <input 
                    type="checkbox" 
                    checked={item.checked}
                    onChange={() => toggleShoppingItem(item.id)}
                  />
                  <span className="item-text">{item.item}</span>
                  <button className="remove-item">×</button>
                </div>
              ))}
            </div>

            <div className="list-actions">
              <button className="clear-checked">Clear Completed</button>
              <button className="export-list">Export List</button>
            </div>
          </div>
        </div>
      </div>

      {/* Scanner Modal */}
      {showScanner && (
        <ScanItem 
          onAddItem={handleAddItem}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <Profile 
          user={currentUser}
          onClose={() => setShowProfileModal(false)}
          onUpdateUser={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default Dashboard;