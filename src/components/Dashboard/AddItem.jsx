import React, { useState } from 'react';
import '../../styles/addItem.css';

const AddItem = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    expiryDate: '',
    location: 'Pantry'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'Fruits',
    'Vegetables', 
    'Dairy',
    'Meat',
    'Grains',
    'Canned Goods',
    'Beverages',
    'Snacks',
    'Frozen',
    'Other'
  ];

  const units = [
    'pcs',
    'kg',
    'g',
    'L',
    'ml',
    'bottles',
    'cans',
    'packages'
  ];

  const locations = [
    'Pantry',
    'Refrigerator',
    'Freezer',
    'Cupboard',
    'Counter'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear errors when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else {
      const today = new Date();
      const expiryDate = new Date(formData.expiryDate);
      if (expiryDate < today) {
        newErrors.expiryDate = 'Expiry date cannot be in the past';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const newItem = {
          ...formData,
          id: Date.now(),
          quantity: parseFloat(formData.quantity)
        };
        
        await onAdd(newItem);
        onClose();
      } catch (error) {
        setErrors({ general: 'Failed to add item. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="add-item-overlay">
      <div className="add-item-modal">
        <div className="modal-header">
          <h2>Add New Item</h2>
          <button 
            onClick={onClose} 
            className="close-btn"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="add-item-form">
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Item Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="e.g., Organic Apples"
                disabled={isLoading}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="category" className="form-label">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`form-input ${errors.category ? 'error' : ''}`}
                disabled={isLoading}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantity" className="form-label">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className={`form-input ${errors.quantity ? 'error' : ''}`}
                placeholder="1"
                min="0.1"
                step="0.1"
                disabled={isLoading}
              />
              {errors.quantity && <span className="error-message">{errors.quantity}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="unit" className="form-label">Unit</label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="form-input"
                disabled={isLoading}
              >
                <option value="">Select unit</option>
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryDate" className="form-label">Expiry Date *</label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className={`form-input ${errors.expiryDate ? 'error' : ''}`}
                min={new Date().toISOString().split('T')[0]}
                disabled={isLoading}
              />
              {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="location" className="form-label">Location</label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
                disabled={isLoading}
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Adding...
                </>
              ) : (
                'Add Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
