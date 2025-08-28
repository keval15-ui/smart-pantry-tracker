import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { pantryService } from '../../services/database.js';
import PantryItem from './PantryItem';
import EditItem from './EditItem';
import '../../styles/viewAllItems.css';

const ViewAllItems = ({ onClose }) => {
  const { user } = useAuth();
  const [pantryItems, setPantryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showEditItem, setShowEditItem] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Test function to add a sample item
  const addTestItem = async () => {
    if (!user?.uid) return;
    
    try {
      console.log('Adding test item...');
      const testItem = {
        name: 'Test Item',
        category: 'Other',
        quantity: 1,
        unit: 'pcs',
        expiryDate: '2025-12-31',
        location: 'Pantry'
      };
      
      const addedItem = await pantryService.addItem(user.uid, testItem);
      console.log('Test item added:', addedItem);
      
      // Reload items
      const items = await pantryService.getItems(user.uid);
      setPantryItems(items);
      setFilteredItems(items);
    } catch (error) {
      console.error('Failed to add test item:', error);
    }
  };

  // Load pantry items
  useEffect(() => {
    const loadItems = async () => {
      if (!user?.uid) {
        console.log('ViewAllItems: No user ID available');
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        console.log('ViewAllItems: Loading items for user:', user.uid);
        
        const items = await pantryService.getItems(user.uid);
        console.log('ViewAllItems: Loaded items:', items);
        
        setPantryItems(items);
        setFilteredItems(items);
      } catch (error) {
        console.error('ViewAllItems: Failed to load items:', error);
        setError('Failed to load your pantry items. Please try again.');
        
        // Fallback to empty array instead of leaving in loading state
        setPantryItems([]);
        setFilteredItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, [user?.uid]);

  // Filter and sort items
  useEffect(() => {
    let filtered = [...pantryItems];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Apply location filter
    if (selectedLocation) {
      filtered = filtered.filter(item => item.location === selectedLocation);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        case 'expiryDate':
          aValue = new Date(a.expiryDate);
          bValue = new Date(b.expiryDate);
          break;
        case 'quantity':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case 'location':
          aValue = a.location.toLowerCase();
          bValue = b.location.toLowerCase();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredItems(filtered);
  }, [pantryItems, searchTerm, selectedCategory, selectedLocation, sortBy, sortOrder]);

  // Get unique categories and locations for filter dropdowns
  const categories = [...new Set(pantryItems.map(item => item.category))].sort();
  const locations = [...new Set(pantryItems.map(item => item.location))].sort();

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowEditItem(true);
  };

  const handleSaveEdit = async (itemId, updatedData) => {
    try {
      setError(null);
      await pantryService.updateItem(itemId, updatedData);
      
      // Update local state
      const updatedItems = pantryItems.map(item => 
        item.id === itemId ? { ...item, ...updatedData } : item
      );
      setPantryItems(updatedItems);
    } catch (error) {
      console.error('Failed to update item:', error);
      setError('Failed to update item. Please try again.');
      throw error;
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
      } catch (error) {
        console.error('Failed to delete item:', error);
        setError('Failed to delete item. Please try again.');
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLocation('');
    setSortBy('name');
    setSortOrder('asc');
  };

  const getExpiryStatus = (expiryDate) => {
    const days = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return 'expired';
    if (days <= 7) return 'warning';
    return 'fresh';
  };

  const getStatusCounts = () => {
    const fresh = filteredItems.filter(item => getExpiryStatus(item.expiryDate) === 'fresh').length;
    const warning = filteredItems.filter(item => getExpiryStatus(item.expiryDate) === 'warning').length;
    const expired = filteredItems.filter(item => getExpiryStatus(item.expiryDate) === 'expired').length;
    return { fresh, warning, expired };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="view-all-modal">
      <div className="view-all-content">
        {/* Header */}
        <div className="view-all-header">
          <div className="header-left">
            <h2>� Search Pantry Items</h2>
            <p>Search to check if items are in your pantry</p>
          </div>
          <button onClick={onClose} className="close-button">
            ✕
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="error-close">
              ✕
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar">
            <div className="search-input-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search for an item in your pantry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="clear-search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          {/* Debug Test Button */}
          <div style={{ marginTop: '10px' }}>
            <button 
              onClick={addTestItem}
              style={{
                padding: '8px 16px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Add Test Item (Debug)
            </button>
          </div>

          {/* Search Results */}
          {searchTerm && (
            <div className="search-results">
              {filteredItems.length > 0 ? (
                <div className="found-message">
                  <span className="found-icon">✅</span>
                  <span className="found-text">
                    Found {filteredItems.length} item{filteredItems.length > 1 ? 's' : ''} matching "{searchTerm}"
                  </span>
                </div>
              ) : (
                <div className="not-found-message">
                  <span className="not-found-icon">❌</span>
                  <span className="not-found-text">
                    No items found matching "{searchTerm}" in your pantry
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="items-container">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your pantry items...</p>
            </div>
          ) : !searchTerm ? (
            <div className="search-prompt">
              <div className="search-prompt-icon">🔍</div>
              <h3>Search Your Pantry</h3>
              <p>Type the name of an item above to check if it's in your pantry</p>
              <div className="quick-stats">
                <p>You have <strong>{pantryItems.length}</strong> items in your pantry</p>
              </div>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="items-grid">
              {filteredItems.map((item, index) => (
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
              <div className="empty-icon">�</div>
              <h3>Item not found</h3>
              <p>
                "{searchTerm}" is not in your pantry. You might want to add it!
              </p>
            </div>
          )}
        </div>
      </div>

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

export default ViewAllItems;
