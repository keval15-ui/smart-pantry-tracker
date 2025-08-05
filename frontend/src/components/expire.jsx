import React, { useState } from 'react';
import './expire.css';

const Expir = ({ pantryItems, onClose }) => {
  const [search, setSearch] = useState('');
  const today = new Date();
  const expiringItems = pantryItems.filter(item => {
    const expiry = new Date(item.expiryDate);
    const days = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return days <= 7;
  }).filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="expir-overlay">
      <div className="expir-modal">
        <div className="expir-header">
          <h2>Expiring Soon</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <input
          className="expir-search"
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {expiringItems.length === 0 ? (
          <div className="empty-expiring">
            <span role="img" aria-label="check">✅</span>
            <p>No items expiring soon!</p>
          </div>
        ) : (
          <div className="expiring-list expir-scroll">
            {expiringItems.map(item => (
              <div key={item.id} className="expiring-item">
                <span className="item-name">{item.name}</span>
                <span className="item-date">{item.expiryDate}</span>
                <span className="item-category">{item.category}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Expir;