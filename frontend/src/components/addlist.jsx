import React, { useState, useEffect } from 'react';
import './addlist.css';

const AddList = ({ shoppingList, onUpdateShoppingList, onClose }) => {
  const [items, setItems] = useState(shoppingList || []);
  const [newItem, setNewItem] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('added');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [editText, setEditText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Other');
  const [priority, setPriority] = useState('normal');

  const categories = [
    'All', 'Produce', 'Dairy', 'Meat & Seafood', 'Bakery', 
    'Frozen', 'Pantry', 'Beverages', 'Snacks', 'Health & Beauty', 
    'Household', 'Other'
  ];

  const priorities = [
    { value: 'high', label: 'High Priority', icon: '🔴' },
    { value: 'normal', label: 'Normal', icon: '🟡' },
    { value: 'low', label: 'Low Priority', icon: '🟢' }
  ];

  // Suggested items based on common shopping needs
  const suggestedItems = [
    { name: 'Milk', category: 'Dairy' },
    { name: 'Bread', category: 'Bakery' },
    { name: 'Eggs', category: 'Dairy' },
    { name: 'Bananas', category: 'Produce' },
    { name: 'Chicken Breast', category: 'Meat & Seafood' },
    { name: 'Rice', category: 'Pantry' },
    { name: 'Pasta', category: 'Pantry' },
    { name: 'Tomatoes', category: 'Produce' },
    { name: 'Yogurt', category: 'Dairy' },
    { name: 'Onions', category: 'Produce' }
  ];

  // Filter and sort items
  const filteredItems = items
    .filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.item.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.item.localeCompare(b.item);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'priority':
          const priorityOrder = { 'high': 3, 'normal': 2, 'low': 1 };
          return (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
        case 'added':
        default:
          return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
      }
    });

  // Group items by category for better organization
  const groupedItems = filteredItems.reduce((groups, item) => {
    const category = item.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  const handleAddItem = () => {
    if (!newItem.trim()) return;

    const item = {
      id: Date.now(),
      item: newItem.trim(),
      category: newItemCategory,
      priority: priority,
      checked: false,
      dateAdded: new Date().toISOString(),
      notes: ''
    };

    const updatedItems = [...items, item];
    setItems(updatedItems);
    onUpdateShoppingList(updatedItems);
    
    setNewItem('');
    setNewItemCategory('Other');
    setPriority('normal');
  };

  const handleQuickAdd = (suggestedItem) => {
    // Check if item already exists
    const exists = items.some(item => 
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
      dateAdded: new Date().toISOString(),
      notes: ''
    };

    const updatedItems = [...items, item];
    setItems(updatedItems);
    onUpdateShoppingList(updatedItems);
  };

  const handleToggleItem = (itemId) => {
    const updatedItems = items.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    setItems(updatedItems);
    onUpdateShoppingList(updatedItems);
  };

  const handleDeleteItem = (itemId) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    onUpdateShoppingList(updatedItems);
  };

  const handleEditItem = (item) => {
    setItemToEdit(item.id);
    setEditText(item.item);
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) return;

    const updatedItems = items.map(item =>
      item.id === itemToEdit ? { ...item, item: editText.trim() } : item
    );
    setItems(updatedItems);
    onUpdateShoppingList(updatedItems);
    setItemToEdit(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setItemToEdit(null);
    setEditText('');
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedItems.length} selected items?`)) {
      const updatedItems = items.filter(item => !selectedItems.includes(item.id));
      setItems(updatedItems);
      onUpdateShoppingList(updatedItems);
      setSelectedItems([]);
      setShowBulkActions(false);
    }
  };

  const handleBulkCheck = () => {
    const updatedItems = items.map(item =>
      selectedItems.includes(item.id) ? { ...item, checked: true } : item
    );
    setItems(updatedItems);
    onUpdateShoppingList(updatedItems);
    setSelectedItems([]);
    setShowBulkActions(false);
  };

  const handleClearCompleted = () => {
    const completedCount = items.filter(item => item.checked).length;
    if (completedCount === 0) {
      alert('No completed items to clear!');
      return;
    }
    
    if (window.confirm(`Remove ${completedCount} completed items?`)) {
      const updatedItems = items.filter(item => !item.checked);
      setItems(updatedItems);
      onUpdateShoppingList(updatedItems);
    }
  };

  const getPriorityIcon = (priority) => {
    const priorityConfig = priorities.find(p => p.value === priority);
    return priorityConfig ? priorityConfig.icon : '🟡';
  };

  const getStats = () => {
    const total = items.length;
    const completed = items.filter(item => item.checked).length;
    const remaining = total - completed;
    const highPriority = items.filter(item => item.priority === 'high' && !item.checked).length;
    
    return { total, completed, remaining, highPriority };
  };

  const stats = getStats();

  return (
    <div className="addlist-page">
      <div className="addlist-content">
        {/* Header */}
        <div className="addlist-header">
          <div className="header-top">
            <button className="back-btn" onClick={onClose}>
              ← Back to Dashboard
            </button>
            <div className="header-title">
              <h1>🛒 Shopping List</h1>
              <p>Organize your shopping needs efficiently</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="stats-cards">
            <div className="stat-card total">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Items</span>
            </div>
            <div className="stat-card remaining">
              <span className="stat-number">{stats.remaining}</span>
              <span className="stat-label">Remaining</span>
            </div>
            <div className="stat-card completed">
              <span className="stat-number">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-card priority">
              <span className="stat-number">{stats.highPriority}</span>
              <span className="stat-label">High Priority</span>
            </div>
          </div>
        </div>

        {/* Add New Item Section */}
        <div className="add-item-section">
          <div className="add-item-form">
            <div className="main-input-group">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="What do you need to buy?"
                className="new-item-input"
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
              />
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="category-select"
              >
                {categories.filter(cat => cat !== 'All').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="priority-select"
              >
                {priorities.map(p => (
                  <option key={p.value} value={p.value}>
                    {p.icon} {p.label}
                  </option>
                ))}
              </select>
              <button onClick={handleAddItem} className="add-btn" disabled={!newItem.trim()}>
                Add Item
              </button>
            </div>
          </div>

          {/* Quick Add Suggestions */}
          <div className="quick-add-section">
            <h3>Quick Add Common Items:</h3>
            <div className="suggestions-grid">
              {suggestedItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAdd(item)}
                  className="suggestion-btn"
                >
                  + {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="list-controls">
          <div className="filters">
            <div className="search-group">
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
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
              <option value="added">Recently Added</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="category">By Category</option>
              <option value="priority">By Priority</option>
            </select>
          </div>

          <div className="actions">
            {selectedItems.length > 0 && (
              <div className="bulk-actions">
                <button onClick={() => setShowBulkActions(!showBulkActions)}>
                  Actions ({selectedItems.length})
                </button>
                {showBulkActions && (
                  <div className="bulk-dropdown">
                    <button onClick={handleBulkCheck}>Mark as Complete</button>
                    <button onClick={handleBulkDelete} className="danger">Delete Selected</button>
                  </div>
                )}
              </div>
            )}
            
            <button onClick={handleSelectAll} className="select-all-btn">
              {selectedItems.length === filteredItems.length ? 'Deselect All' : 'Select All'}
            </button>
            
            <button onClick={handleClearCompleted} className="clear-btn">
              Clear Completed ({stats.completed})
            </button>
          </div>
        </div>

        {/* Shopping List */}
        <div className="shopping-list">
          {filteredItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>Your shopping list is empty!</h3>
              <p>Add items above or use the quick-add suggestions to get started.</p>
            </div>
          ) : selectedCategory === 'All' && sortBy === 'category' ? (
            // Group by category view
            Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category} className="category-group">
                <h3 className="category-header">
                  {category} ({categoryItems.length})
                </h3>
                <div className="items-grid">
                  {categoryItems.map(item => (
                    <div key={item.id} className={`list-item ${item.checked ? 'checked' : ''}`}>
                      <div className="item-select">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                        />
                      </div>
                      
                      <div className="item-checkbox">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => handleToggleItem(item.id)}
                        />
                      </div>
                      
                      <div className="item-content">
                        {itemToEdit === item.id ? (
                          <div className="edit-form">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="edit-input"
                              autoFocus
                              onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                            />
                            <div className="edit-actions">
                              <button onClick={handleSaveEdit} className="save-btn">✓</button>
                              <button onClick={handleCancelEdit} className="cancel-btn">✕</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="item-info">
                              <span className="item-name">{item.item}</span>
                              <span className="item-category">{item.category}</span>
                            </div>
                            <div className="item-priority">
                              {getPriorityIcon(item.priority)}
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="item-actions">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="action-btn edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="action-btn delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Regular list view
            <div className="items-grid">
              {filteredItems.map(item => (
                <div key={item.id} className={`list-item ${item.checked ? 'checked' : ''}`}>
                  <div className="item-select">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                    />
                  </div>
                  
                  <div className="item-checkbox">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleToggleItem(item.id)}
                    />
                  </div>
                  
                  <div className="item-content">
                    {itemToEdit === item.id ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="edit-input"
                          autoFocus
                          onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                        />
                        <div className="edit-actions">
                          <button onClick={handleSaveEdit} className="save-btn">✓</button>
                          <button onClick={handleCancelEdit} className="cancel-btn">✕</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="item-info">
                          <span className="item-name">{item.item}</span>
                          <span className="item-category">{item.category}</span>
                        </div>
                        <div className="item-priority">
                          {getPriorityIcon(item.priority)}
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="item-actions">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="action-btn edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="action-btn delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Footer */}
        {items.length > 0 && (
          <div className="quick-actions-footer">
            <div className="action-summary">
              <span>{stats.remaining} items remaining • {stats.completed} completed</span>
            </div>
            <div className="action-buttons">
              <button className="share-btn">📤 Share List</button>
              <button className="export-btn">📁 Export List</button>
              <button className="print-btn">🖨️ Print List</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddList;