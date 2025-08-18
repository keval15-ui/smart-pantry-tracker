import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { pantryService } from '../../services/database.js';
import PantryItem from './PantryItem';
import AddItem from './AddItem';
import EditItem from './EditItem';
import '../../styles/dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [pantryItems, setPantryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalItems: 0,
    expiringSoon: 0,
    categories: 0,
    expired: 0
  });

  // Load pantry items from database
  useEffect(() => {
    const loadPantryItems = async () => {
      if (!user?.uid) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const items = await pantryService.getItems(user.uid);
        setPantryItems(items);
        updateStats(items);
      } catch (error) {
        console.error('Failed to load pantry items:', error);
        setError('Failed to load your pantry items. Please try refreshing the page.');
        
        // Fallback to mock data for development
        const mockItems = [
          {
            id: 'mock-1',
            name: 'Organic Apples',
            category: 'Fruits',
            quantity: 8,
            unit: 'pcs',
            expiryDate: '2025-08-15',
            location: 'Refrigerator'
          },
          {
            id: 'mock-2',
            name: 'Whole Milk',
            category: 'Dairy',
            quantity: 1,
            unit: 'L',
            expiryDate: '2025-08-14',
            location: 'Refrigerator'
          }
        ];
        setPantryItems(mockItems);
        updateStats(mockItems);
      } finally {
        setIsLoading(false);
      }
    };

    loadPantryItems();
  }, [user?.uid]);

  const handleAddItem = async (newItem) => {
    try {
      setError(null);
      
      const addedItem = await pantryService.addItem(user.uid, newItem);
      const updatedItems = [...pantryItems, addedItem];
      
      setPantryItems(updatedItems);
      updateStats(updatedItems);
      
      console.log('Added item:', addedItem);
    } catch (error) {
      console.error('Failed to add item:', error);
      setError('Failed to add item. Please try again.');
      throw error; // Re-throw to handle in AddItem component
    }
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

  const handleEditItem = async (item) => {
    console.log('Edit item:', item);
    setEditingItem(item);
    setShowEditItem(true);
  };

  const handleSaveEdit = async (itemId, updatedData) => {
    try {
      setError(null);
      
      await pantryService.updateItem(itemId, updatedData);
      
      // Update the local state
      const updatedItems = pantryItems.map(item => 
        item.id === itemId 
          ? { ...item, ...updatedData }
          : item
      );
      
      setPantryItems(updatedItems);
      updateStats(updatedItems);
      
      console.log('Updated item:', itemId, updatedData);
    } catch (error) {
      console.error('Failed to update item:', error);
      setError('Failed to update item. Please try again.');
      throw error; // Re-throw to handle in EditItem component
    }
  };

  const handleCloseEdit = () => {
    setShowEditItem(false);
    setEditingItem(null);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        setError(null);
        
        await pantryService.deleteItem(itemId);
        const updatedItems = pantryItems.filter(item => item.id !== itemId);
        
        setPantryItems(updatedItems);
        updateStats(updatedItems);
        
        console.log('Deleted item:', itemId);
      } catch (error) {
        console.error('Failed to delete item:', error);
        setError('Failed to delete item. Please try again.');
      }
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
          {/* Error Message */}
          {error && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="error-close"
              >
                ✕
              </button>
            </div>
          )}

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
                    <span className="action-icon">👀</span>
                    <span className="action-text">View All Items</span>
                  </button>
                  <button className="action-card">
                    <span className="action-icon">📊</span>
                    <span className="action-text">Generate Report</span>
                  </button>
                  <button className="action-card">
                    <span className="action-icon">🔔</span>
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

      {/* Edit Item Modal */}
      {showEditItem && editingItem && (
        <EditItem
          item={editingItem}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default Dashboard;
