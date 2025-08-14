import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import PantryItem from './PantryItem';
import AddItem from './AddItem';
import '../../styles/dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [pantryItems, setPantryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddItem, setShowAddItem] = useState(false);
  const [stats, setStats] = useState({
    totalItems: 0,
    expiringSoon: 0,
    categories: 0,
    expired: 0
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockItems = [
      {
        id: 1,
        name: 'Organic Apples',
        category: 'Fruits',
        quantity: 8,
        unit: 'pcs',
        expiryDate: '2025-08-15',
        location: 'Refrigerator'
      },
      {
        id: 2,
        name: 'Whole Milk',
        category: 'Dairy',
        quantity: 1,
        unit: 'L',
        expiryDate: '2025-08-14',
        location: 'Refrigerator'
      },
      {
        id: 3,
        name: 'Brown Rice',
        category: 'Grains',
        quantity: 2,
        unit: 'kg',
        expiryDate: '2025-12-30',
        location: 'Pantry'
      },
      {
        id: 4,
        name: 'Old Bread',
        category: 'Bakery',
        quantity: 1,
        unit: 'loaf',
        expiryDate: '2025-01-01', // Expired for demo
        location: 'Pantry'
      }
    ];

    setTimeout(() => {
      setPantryItems(mockItems);
      
      setStats({
        totalItems: mockItems.length,
        expiringSoon: mockItems.filter(item => {
          const days = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
          return days <= 7 && days >= 0;
        }).length,
        expired: mockItems.filter(item => {
          const days = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
          return days < 0;
        }).length,
        categories: new Set(mockItems.map(item => item.category)).size
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleAddItem = (newItem) => {
    setPantryItems(prevItems => [...prevItems, newItem]);
    updateStats([...pantryItems, newItem]);
    console.log('Added item:', newItem);
  };

  const updateStats = (items) => {
    setStats({
      totalItems: items.length,
      expiringSoon: items.filter(item => {
        const days = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        return days <= 7 && days >= 0;
      }).length,
      expired: items.filter(item => {
        const days = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        return days < 0;
      }).length,
      categories: new Set(items.map(item => item.category)).size
    });
  };

  const handleEditItem = (item) => {
    console.log('Edit item:', item);
    // Add edit functionality here
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const updatedItems = pantryItems.filter(item => item.id !== itemId);
      setPantryItems(updatedItems);
      updateStats(updatedItems);
      console.log('Delete item:', itemId);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">🥕 FreshTrack</h1>
            <p className="dashboard-subtitle">
              {getGreeting()}, {user?.name || 'User'}! Keep your fresh produce organized and reduce waste.
            </p>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-primary add-item-btn"
              onClick={() => setShowAddItem(true)}
            >
              ➕ Add Item
            </button>
            <button onClick={handleLogout} className="btn btn-outline logout-btn">
              🚪 Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="dashboard-main">
        <div className="dashboard-content">
          {isLoading ? (
            <div className="loading-section">
              <div className="spinner"></div>
              <p>Loading your fresh pantry...</p>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card total">
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <h3>Total Items</h3>
                    <p className="stat-number">{stats.totalItems}</p>
                  </div>
                </div>
                <div className="stat-card expiring">
                  <div className="stat-icon">⏰</div>
                  <div className="stat-info">
                    <h3>Expiring Soon</h3>
                    <p className="stat-number">{stats.expiringSoon}</p>
                  </div>
                </div>
                <div className="stat-card categories">
                  <div className="stat-icon">🏷️</div>
                  <div className="stat-info">
                    <h3>Categories</h3>
                    <p className="stat-number">{stats.categories}</p>
                  </div>
                </div>
                <div className="stat-card expired">
                  <div className="stat-icon">🗑️</div>
                  <div className="stat-info">
                    <h3>Expired Items</h3>
                    <p className="stat-number">{stats.expired}</p>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="action-section">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                  <button className="action-card">
                    <span className="action-icon">📱</span>
                    <span className="action-text">Scan Barcode</span>
                  </button>
                  <button className="action-card">
                    <span className="action-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                        <path d="m9 16 2 2 4-4"></path>
                      </svg>
                    </span>
                    <span className="action-text">View All Items</span>
                  </button>
                  <button className="action-card">
                    <span className="action-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14,2 14,8 20,8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10,9 9,9 8,9"></polyline>
                      </svg>
                    </span>
                    <span className="action-text">Generate Report</span>
                  </button>
                  <button className="action-card">
                    <span className="action-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
                    </span>
                    <span className="action-text">Notifications</span>
                  </button>
                </div>
              </div>
              
              {/* Recent Items */}
              <div className="recent-section">
                <h2>Your Pantry Items</h2>
                {pantryItems.length > 0 ? (
                  <div className="pantry-items-grid">
                    {pantryItems.map((item, index) => (
                      <div key={item.id} style={{ '--delay': index }}>
                        <PantryItem
                          item={item}
                          onEdit={handleEditItem}
                          onDelete={handleDeleteItem}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <h3>Your pantry is empty</h3>
                    <p>Start adding fresh items to track their expiration dates and reduce waste.</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowAddItem(true)}
                    >
                      Add Your First Item
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      
      {/* Add Item Modal */}
      {showAddItem && (
        <AddItem
          onClose={() => setShowAddItem(false)}
          onAdd={handleAddItem}
        />
      )}
    </div>
  );
};

export default Dashboard;
