import React, { useState, useEffect } from 'react';
import ScanItem from './Scanitem';
import Profile from './Profile';
import Expir from './expire';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [pantryItems, setPantryItems] = useState([
    {
      id: 1,
      name: 'Milk',
      quantity: 1,
      expiryDate: '2024-01-15',
      category: 'Dairy',
      daysUntilExpiry: 2,
      location: 'Refrigerator'
    },
    {
      id: 2,
      name: 'Bread',
      quantity: 1,
      expiryDate: '2024-01-18',
      category: 'Bakery',
      daysUntilExpiry: 5,
      location: 'Pantry'
    },
    {
      id: 3,
      name: 'Tomatoes',
      quantity: 3,
      expiryDate: '2024-01-20',
      category: 'Produce',
      daysUntilExpiry: 7,
      location: 'Refrigerator'
    },
    {
      id: 4,
      name: 'Canned Beans',
      quantity: 2,
      expiryDate: '2024-06-15',
      category: 'Canned',
      daysUntilExpiry: 150,
      location: 'Pantry'
    },
    {
      id: 5,
      name: 'Yogurt',
      quantity: 2,
      expiryDate: '2024-01-12',
      category: 'Dairy',
      daysUntilExpiry: -1,
      location: 'Refrigerator'
    },
    {
      id: 6,
      name: 'Bananas',
      quantity: 5,
      expiryDate: '2024-01-14',
      category: 'Produce',
      daysUntilExpiry: 1,
      location: 'Counter'
    }
  ]);

  const [shoppingList, setShoppingList] = useState([
    { id: 1, item: 'Milk', checked: false, category: 'Dairy', priority: 'normal', dateAdded: new Date().toISOString() },
    { id: 2, item: 'Eggs', checked: false, category: 'Dairy', priority: 'normal', dateAdded: new Date().toISOString() }
  ]);

  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('expiry');
  const [showProfile, setShowProfile] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showExpiring, setShowExpiring] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  
  // Enhanced shopping list states
  const [newShoppingItem, setNewShoppingItem] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Other');
  const [newItemPriority, setNewItemPriority] = useState('normal');
  const [searchShoppingList, setSearchShoppingList] = useState('');
  const [shoppingFilter, setShoppingFilter] = useState('All');
  const [showAdvancedList, setShowAdvancedList] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [editText, setEditText] = useState('');

  // Calculate dashboard stats
  const expiringItems = pantryItems.filter(item => item.daysUntilExpiry <= 7);
  const lowStockItems = pantryItems.filter(item => item.quantity <= 2);
  const totalItems = pantryItems.length;
  const moneySaved = 25;

  const categories = ['All', ...new Set(pantryItems.map(item => item.category))];
  
  const shoppingCategories = [
    'All', 'Produce', 'Dairy', 'Meat & Seafood', 'Bakery', 
    'Frozen', 'Pantry', 'Beverages', 'Snacks', 'Health & Beauty', 
    'Household', 'Other'
  ];

  const priorities = [
    { value: 'high', label: 'High Priority', icon: '🔴' },
    { value: 'normal', label: 'Normal', icon: '🟡' },
    { value: 'low', label: 'Low Priority', icon: '🟢' }
  ];

  const suggestedItems = [
    { name: 'Milk', category: 'Dairy' },
    { name: 'Bread', category: 'Bakery' },
    { name: 'Eggs', category: 'Dairy' },
    { name: 'Bananas', category: 'Produce' },
    { name: 'Chicken Breast', category: 'Meat & Seafood' },
    { name: 'Rice', category: 'Pantry' }
  ];

  const filteredItems = pantryItems
    .filter(item => filterCategory === 'All' || item.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'expiry') return a.daysUntilExpiry - b.daysUntilExpiry;
      if (sortBy === 'quantity') return a.quantity - b.quantity;
      return a.name.localeCompare(b.name);
    });

  // Filter shopping list
  const filteredShoppingList = shoppingList
    .filter(item => {
      const matchesCategory = shoppingFilter === 'All' || item.category === shoppingFilter;
      const matchesSearch = item.item.toLowerCase().includes(searchShoppingList.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const priorityOrder = { 'high': 3, 'normal': 2, 'low': 1 };
      return (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
    });

  const handleAddItem = (newItem) => {
    setPantryItems([...pantryItems, newItem]);
    console.log('New item added:', newItem);
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    console.log('User updated:', updatedUser);
  };

  const handleUpdateItem = (itemId) => {
    console.log('Update item:', itemId);
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setPantryItems(pantryItems.filter(item => item.id !== itemId));
    }
  };

  const addToShoppingList = (itemName) => {
    // Check if item already exists
    const exists = shoppingList.some(item => 
      item.item.toLowerCase() === itemName.toLowerCase()
    );
    
    if (exists) {
      alert('Item already in shopping list!');
      return;
    }

    const newItem = {
      id: Date.now(),
      item: itemName,
      category: 'Other',
      priority: 'normal',
      checked: false,
      dateAdded: new Date().toISOString()
    };
    setShoppingList([...shoppingList, newItem]);
  };

  const handleAddShoppingItem = () => {
    if (!newShoppingItem.trim()) return;

    // Check if item already exists
    const exists = shoppingList.some(item => 
      item.item.toLowerCase() === newShoppingItem.trim().toLowerCase()
    );
    
    if (exists) {
      alert('Item already in your list!');
      return;
    }

    const newItem = {
      id: Date.now(),
      item: newShoppingItem.trim(),
      category: newItemCategory,
      priority: newItemPriority,
      checked: false,
      dateAdded: new Date().toISOString()
    };

    setShoppingList([...shoppingList, newItem]);
    setNewShoppingItem('');
    setNewItemCategory('Other');
    setNewItemPriority('normal');
  };

  const handleQuickAdd = (suggestedItem) => {
    const exists = shoppingList.some(item => 
      item.item.toLowerCase() === suggestedItem.name.toLowerCase()
    );
    
    if (exists) {
      alert('Item already in your list!');
      return;
    }

    const item = {
      id: Date.now(),
      item: suggestedItem.name,
      category: suggestedItem.category,
      priority: 'normal',
      checked: false,
      dateAdded: new Date().toISOString()
    };

    setShoppingList([...shoppingList, item]);
  };

  const toggleShoppingItem = (id) => {
    setShoppingList(shoppingList.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleDeleteShoppingItem = (itemId) => {
    setShoppingList(shoppingList.filter(item => item.id !== itemId));
  };

  const handleEditShoppingItem = (item) => {
    setItemToEdit(item.id);
    setEditText(item.item);
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) return;

    setShoppingList(shoppingList.map(item =>
      item.id === itemToEdit ? { ...item, item: editText.trim() } : item
    ));
    setItemToEdit(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setItemToEdit(null);
    setEditText('');
  };

  const handleClearCompleted = () => {
    const completedCount = shoppingList.filter(item => item.checked).length;
    if (completedCount === 0) {
      alert('No completed items to clear!');
      return;
    }
    
    if (window.confirm(`Remove ${completedCount} completed items?`)) {
      setShoppingList(shoppingList.filter(item => !item.checked));
    }
  };

  const getPriorityIcon = (priority) => {
    const priorityConfig = priorities.find(p => p.value === priority);
    return priorityConfig ? priorityConfig.icon : '🟡';
  };

  const getShoppingStats = () => {
    const total = shoppingList.length;
    const completed = shoppingList.filter(item => item.checked).length;
    const remaining = total - completed;
    const highPriority = shoppingList.filter(item => item.priority === 'high' && !item.checked).length;
    
    return { total, completed, remaining, highPriority };
  };

  const shoppingStats = getShoppingStats();

  return (
    <div className="dashboard-container">
      {/* Header - Removed Manage List button */}
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
          <button 
            className="action-btn secondary"
            onClick={() => setShowExpiring(true)}
          >
            <span className="btn-icon">⚠️</span>
            View Expiring
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
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowProfile(false);
                  }}
                >
                  Profile
                </button>
                <button className="dropdown-item">Settings</button>
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

        <div className="summary-card alert">
          <div className="card-icon">⏰</div>
          <div className="card-content">
            <h3>{expiringItems.length}</h3>
            <p>Expiring Soon</p>
          </div>
          <button className="card-action" onClick={() => setShowExpiring(true)}>
            View Expiring
          </button>
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

        {/* Enhanced Shopping List Sidebar */}
        <div className="shopping-sidebar">
          <div className="shopping-list-card">
            <div className="list-header">
              <h3>🛒 Shopping List ({shoppingStats.total})</h3>
              <button 
                className="toggle-advanced-btn"
                onClick={() => setShowAdvancedList(!showAdvancedList)}
              >
                {showAdvancedList ? 'Simple' : 'Advanced'}
              </button>
            </div>

            {/* Stats Mini Cards */}
            <div className="shopping-stats">
              <div className="mini-stat">
                <span className="mini-number">{shoppingStats.remaining}</span>
                <span className="mini-label">Remaining</span>
              </div>
              <div className="mini-stat">
                <span className="mini-number">{shoppingStats.completed}</span>
                <span className="mini-label">Done</span>
              </div>
              <div className="mini-stat">
                <span className="mini-number">{shoppingStats.highPriority}</span>
                <span className="mini-label">Priority</span>
              </div>
            </div>

            {/* Enhanced Add Item Form */}
            <div className="enhanced-add-form">
              <div className="main-add-input">
                <input 
                  type="text" 
                  placeholder="Add item to shopping list..."
                  className="add-item-input"
                  value={newShoppingItem}
                  onChange={(e) => setNewShoppingItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddShoppingItem()}
                />
                <button 
                  className="add-btn" 
                  onClick={handleAddShoppingItem}
                  disabled={!newShoppingItem.trim()}
                >
                  +
                </button>
              </div>

              {showAdvancedList && (
                <div className="advanced-controls">
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="mini-select"
                  >
                    {shoppingCategories.filter(cat => cat !== 'All').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <select
                    value={newItemPriority}
                    onChange={(e) => setNewItemPriority(e.target.value)}
                    className="mini-select"
                  >
                    {priorities.map(p => (
                      <option key={p.value} value={p.value}>
                        {p.icon} {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Quick Add Suggestions */}
            {showAdvancedList && (
              <div className="quick-suggestions">
                <div className="suggestions-label">Quick Add:</div>
                <div className="suggestions-pills">
                  {suggestedItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAdd(item)}
                      className="suggestion-pill"
                    >
                      + {item.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Advanced Filters */}
            {showAdvancedList && (
              <div className="shopping-filters">
                <input
                  type="text"
                  placeholder="Search list..."
                  value={searchShoppingList}
                  onChange={(e) => setSearchShoppingList(e.target.value)}
                  className="search-mini"
                />
                <select
                  value={shoppingFilter}
                  onChange={(e) => setShoppingFilter(e.target.value)}
                  className="filter-mini"
                >
                  {shoppingCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Shopping Items */}
            <div className="shopping-items">
              {filteredShoppingList.length === 0 ? (
                <div className="empty-shopping">
                  <div className="empty-icon">📝</div>
                  <p>Your shopping list is empty!</p>
                  <p>Add items above to get started.</p>
                </div>
              ) : (
                filteredShoppingList.map(item => (
                  <div key={item.id} className={`shopping-item ${item.checked ? 'checked' : ''}`}>
                    <input 
                      type="checkbox" 
                      checked={item.checked}
                      onChange={() => toggleShoppingItem(item.id)}
                    />
                    
                    <div className="item-content-shopping">
                      {itemToEdit === item.id ? (
                        <div className="edit-form-mini">
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="edit-input-mini"
                            autoFocus
                            onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                            onBlur={handleSaveEdit}
                          />
                          <div className="edit-actions-mini">
                            <button onClick={handleSaveEdit} className="save-mini">✓</button>
                            <button onClick={handleCancelEdit} className="cancel-mini">✕</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="item-text">{item.item}</span>
                          {showAdvancedList && (
                            <div className="item-meta">
                              <span className="item-category-mini">{item.category}</span>
                              <span className="item-priority-mini">{getPriorityIcon(item.priority)}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    <div className="item-actions-mini">
                      {showAdvancedList && (
                        <button 
                          className="edit-mini-btn"
                          onClick={() => handleEditShoppingItem(item)}
                        >
                          ✏️
                        </button>
                      )}
                      <button 
                        className="remove-item"
                        onClick={() => handleDeleteShoppingItem(item.id)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* List Actions */}
            <div className="list-actions">
              <button 
                className="clear-completed"
                onClick={handleClearCompleted}
                disabled={shoppingStats.completed === 0}
              >
                Clear Completed ({shoppingStats.completed})
              </button>
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

      {/* Expiring Items View */}
      {showExpiring && (
        <Expir
          pantryItems={pantryItems}
          onClose={() => setShowExpiring(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;