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
    if (days <= 7) return 'warning';
    return 'fresh';
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
    <div className="pantry-item">
      <div className="item-header">
        <h3 className="item-name">{item.name}</h3>
        <span className="item-category">{item.category}</span>
      </div>
      
      <div className="item-details">
        <div className="item-quantity">
          <span className="quantity-value">{item.quantity} {item.unit || 'pcs'}</span>
        </div>
        
        {item.location && (
          <div className="item-location">
            <span className="location-icon">📍</span>
            <span>{item.location}</span>
          </div>
        )}
      </div>
      
      <div className="item-expiry">
        <div className="expiry-info">
          <span className="expiry-label">Expires:</span>
          <span className="expiry-date">{formatDate(item.expiryDate)}</span>
        </div>
        <span className={`expiry-status ${getExpiryStatus(item.expiryDate)}`}>
          {getExpiryText(item.expiryDate)}
        </span>
      </div>
      
      <div className="item-actions">
        <button 
          onClick={() => onEdit(item)} 
          className="item-action-btn edit-btn"
          title="Edit item"
        >
          ✏️
        </button>
        <button 
          onClick={() => onDelete(item.id)} 
          className="item-action-btn delete-btn"
          title="Delete item"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default PantryItem;
