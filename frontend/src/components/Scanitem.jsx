import React, { useState } from 'react';
import './scanitem.css';

const ScanItem = ({ onAddItem, onClose }) => {
  const [itemData, setItemData] = useState({
    name: '',
    quantity: 1,
    expiryDate: '',
    category: 'Other',
    location: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'Dairy', 'Produce', 'Meat', 'Bakery', 'Canned', 'Frozen', 
    'Snacks', 'Beverages', 'Condiments', 'Grains', 'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItemData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!itemData.name.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (!itemData.quantity || itemData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }

    if (!itemData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Calculate days until expiry
    const today = new Date();
    const expiry = new Date(itemData.expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    const newItem = {
      id: Date.now(),
      ...itemData,
      daysUntilExpiry,
      dateAdded: new Date().toISOString().split('T')[0]
    };

    // Simulate API call
    setTimeout(() => {
      onAddItem(newItem);
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  const resetForm = () => {
    setItemData({
      name: '',
      quantity: 1,
      expiryDate: '',
      category: 'Other',
      location: '',
      notes: ''
    });
    setErrors({});
  };

  return (
    <div className="scan-overlay">
      <div className="scan-container">
        <div className="scan-header">
          <div className="scan-title">
            <span className="scan-icon">➕</span>
            <h2>Add New Item</h2>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="scan-content">
          <div className="item-form-section">
            <form onSubmit={handleSubmit} className="item-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Item Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={itemData.name}
                    onChange={handleInputChange}
                    className={`input-field ${errors.name ? 'error' : ''}`}
                    placeholder="Enter item name"
                    disabled={isLoading}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="quantity" className="form-label">Quantity *</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={itemData.quantity}
                    onChange={handleInputChange}
                    className={`input-field ${errors.quantity ? 'error' : ''}`}
                    min="1"
                    disabled={isLoading}
                  />
                  {errors.quantity && <span className="error-message">{errors.quantity}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="expiryDate" className="form-label">Expiry Date *</label>
                  <input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    value={itemData.expiryDate}
                    onChange={handleInputChange}
                    className={`input-field ${errors.expiryDate ? 'error' : ''}`}
                    min={new Date().toISOString().split('T')[0]}
                    disabled={isLoading}
                  />
                  {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="category" className="form-label">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={itemData.category}
                    onChange={handleInputChange}
                    className="input-field"
                    disabled={isLoading}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="location" className="form-label">Storage Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={itemData.location}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="e.g., Refrigerator, Pantry, Freezer"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="notes" className="form-label">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={itemData.notes}
                    onChange={handleInputChange}
                    className="input-field textarea"
                    placeholder="Additional notes..."
                    rows="3"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={resetForm}
                  disabled={isLoading}
                >
                  Reset
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner-small"></div>
                      Adding...
                    </>
                  ) : (
                    'Add to Pantry'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanItem;