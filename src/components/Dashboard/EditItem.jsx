import React, { useState } from 'react';
import '../../styles/addItem.css'; // We'll reuse the same styles

const EditItem = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: item.name || '',
    category: item.category || '',
    quantity: item.quantity?.toString() || '',
    unit: item.unit || '',
    expiryDate: item.expiryDate || '',
    location: item.location || 'Pantry'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'Fruits', 'Vegetables', 'Dairy', 'Meat', 'Grains', 
    'Snacks', 'Beverages', 'Condiments', 'Frozen', 'Other'
  ];

  const units = [
    'pcs', 'kg', 'g', 'L', 'mL', 'cups', 'tbsp', 'tsp', 
    'cans', 'bottles', 'packages', 'boxes'
  ];

  const locations = [
    'Pantry', 'Refrigerator', 'Freezer', 'Counter'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.quantity || isNaN(formData.quantity) || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Valid quantity is required';
    }

    if (!formData.unit) {
      newErrors.unit = 'Unit is required';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    }

    if (!formData.location) {
      newErrors.location = 'Location is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setErrors({});
      
      try {
        const updatedItem = {
          ...formData,
          quantity: parseFloat(formData.quantity)
        };
        
        await onSave(item.id, updatedItem);
        onClose();
      } catch (error) {
        console.error('Error updating item:', error);
        setErrors({ general: 'Failed to update item. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>✏️ Edit Item</h2>
          <button onClick={onClose} className="close-button">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-item-form">
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Item Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Organic Apples"
                className={errors.name ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={errors.category ? 'error' : ''}
                disabled={isLoading}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <span className="error-text">{errors.category}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="e.g., 5"
                min="0.1"
                step="0.1"
                className={errors.quantity ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.quantity && <span className="error-text">{errors.quantity}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="unit">Unit *</label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className={errors.unit ? 'error' : ''}
                disabled={isLoading}
              >
                <option value="">Select Unit</option>
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
              {errors.unit && <span className="error-text">{errors.unit}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date *</label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className={errors.expiryDate ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.expiryDate && <span className="error-text">{errors.expiryDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="location">Storage Location *</label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={errors.location ? 'error' : ''}
                disabled={isLoading}
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              {errors.location && <span className="error-text">{errors.location}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-outline"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : '💾 Update Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItem;
