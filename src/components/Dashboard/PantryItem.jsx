import React from 'react';
import '../../styles/pantryItem.css';

const PantryItem = ({ item, onEdit, onDelete }) => {
  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (expiryDate) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days < 0) return 'expired';
    if (days <= 3) return 'critical';
    if (days <= 7) return 'warning';
    return 'good';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getExpiryText = (expiryDate) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days < 0) return `Expired ${Math.abs(days)} days ago`;
    if (days === 0) return 'Expires today';
    if (days === 1) return 'Expires tomorrow';
    return `${days} days left`;
  };

  return (
    <div className={`pantry-item ${getExpiryStatus(item.expiryDate)}`}>
      <div className="item-header">
        <div className="item-icon">
          {item.category === 'Fruits' && '🍎'}
          {item.category === 'Vegetables' && '🥕'}
          {item.category === 'Dairy' && '🥛'}
          {item.category === 'Meat' && '🥩'}
          {item.category === 'Grains' && '🌾'}
          {!['Fruits', 'Vegetables', 'Dairy', 'Meat', 'Grains'].includes(item.category) && '📦'}
        </div>
        <div className="item-info">
          <h3 className="item-name">{item.name}</h3>
          <p className="item-category">{item.category}</p>
        </div>
        <div className="item-status">
          <span className={`status-badge ${getExpiryStatus(item.expiryDate)}`}>
            {getExpiryText(item.expiryDate)}
          </span>
        </div>
      </div>
      
      <div className="item-details">
        <div className="detail-item">
          <span className="detail-label">Quantity:</span>
          <span className="detail-value">{item.quantity} {item.unit || 'pcs'}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Expires:</span>
          <span className="detail-value">{formatDate(item.expiryDate)}</span>
        </div>
        {item.location && (
          <div className="detail-item">
            <span className="detail-label">Location:</span>
            <span className="detail-value">{item.location}</span>
          </div>
        )}
      </div>
      
      <div className="item-actions">
        <button 
          onClick={() => onEdit(item)} 
          className="action-btn edit-btn"
          aria-label="Edit item"
        >
          ✏️ Edit
        </button>
        <button 
          onClick={() => onDelete(item.id)} 
          className="action-btn delete-btn"
          aria-label="Delete item"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default PantryItem;
