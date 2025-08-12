import React, { useState, useEffect } from 'react';
import PantryItem from './PantryItem';
import AddItem from './AddItem';
import '../../styles/dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [pantryItems, setPantryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddItem, setShowAddItem] = useState(false);
  const [stats, setStats] = useState({
    totalItems: 0,
    expiringSoon: 0,
    categories: 0
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
        name: 'Carrots',
        category: 'Vegetables',
        quantity: 1.5,
        unit: 'kg',
        expiryDate: '2025-08-10',
        location: 'Refrigerator'
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
            <h1 className="dashboard-title">🥫 Smart Pantry Tracker</h1>
            <p className="dashboard-subtitle">
              {getGreeting()}, {user?.name || 'User'}! Keep track of your pantry items.
            </p>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-primary add-item-btn"
              onClick={() => setShowAddItem(true)}
            >
              ➕ Add Item
            </button>
            <button onClick={onLogout} className="btn btn-outline logout-btn">
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
              <p>Loading your pantry...</p>
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
              </div>
              
              {/* Quick Actions */}
              <div className="action-section">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                  <button 
                    className="action-card"
                    onClick={() => setShowAddItem(true)}
                  >
                    <span className="action-icon">➕</span>
                    <span className="action-text">Add New Item</span>
                  </button>
                  <button className="action-card">
                    <span className="action-icon">📱</span>
                    <span className="action-text">Scan Barcode</span>
                  </button>
                  <button className="action-card">
                    <span className="action-icon">📋</span>
                    <span className="action-text">View All Items</span>
                  </button>
                  <button className="action-card">
                    <span className="action-icon">📈</span>
                    <span className="action-text">Generate Report</span>
                  </button>
                </div>
              </div>
              
              {/* Recent Items */}
              <div className="recent-section">
                <h2>Your Pantry Items</h2>
                {pantryItems.length > 0 ? (
                  <div className="pantry-items-grid">
                    {pantryItems.map(item => (
                      <PantryItem
                        key={item.id}
                        item={item}
                        onEdit={handleEditItem}
                        onDelete={handleDeleteItem}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <h3>Your pantry is empty</h3>
                    <p>Start adding items to track their expiration dates and quantities.</p>
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
