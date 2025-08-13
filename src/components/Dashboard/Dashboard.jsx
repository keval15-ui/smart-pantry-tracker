import React, { useState, useEffect } from 'react';
import PantryItem from './PantryItem';
import AddItem from './AddItem';
import '../../styles/dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [pantryItems, setPantryItems] = useState([]);
  const [activeDonations, setActiveDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showDonationTracker, setShowDonationTracker] = useState(false);
  const [stats, setStats] = useState({
    totalItems: 0,
    expiringSoon: 0,
    categories: 0,
    expired: 0,
    donations: {
      available: 0,
      claimed: 0,
      inTransit: 0,
      delivered: 0
    }
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
        name: 'Old Bread',
        category: 'Bakery',
        quantity: 1,
        unit: 'loaf',
        expiryDate: '2025-01-01', // Expired for demo
        location: 'Pantry'
      }
    ];

    // Mock active donations for demonstration
    const mockDonations = [
      {
        id: 'DON-001',
        itemName: 'Canned Tomatoes',
        category: 'Canned Goods',
        quantity: 5,
        unit: 'cans',
        status: 'available',
        recipient: 'City Food Bank',
        createdAt: '2025-08-12T10:00:00Z',
        updatedAt: '2025-08-12T10:00:00Z',
        estimatedPickup: '2025-08-13T14:00:00Z'
      },
      {
        id: 'DON-002',
        itemName: 'Fresh Vegetables',
        category: 'Produce',
        quantity: 3,
        unit: 'bags',
        status: 'claimed',
        recipient: 'Community Center',
        createdAt: '2025-08-11T15:30:00Z',
        updatedAt: '2025-08-12T09:15:00Z',
        claimedBy: 'Volunteer Sarah',
        estimatedPickup: '2025-08-12T16:00:00Z'
      },
      {
        id: 'DON-003',
        itemName: 'Bread Loaves',
        category: 'Bakery',
        quantity: 8,
        unit: 'loaves',
        status: 'inTransit',
        recipient: 'Local Shelter',
        createdAt: '2025-08-10T12:00:00Z',
        updatedAt: '2025-08-12T08:30:00Z',
        claimedBy: 'Volunteer Mike',
        estimatedDelivery: '2025-08-12T18:00:00Z'
      },
      {
        id: 'DON-004',
        itemName: 'Pasta Boxes',
        category: 'Dry Goods',
        quantity: 12,
        unit: 'boxes',
        status: 'delivered',
        recipient: 'Senior Center',
        createdAt: '2025-08-09T14:00:00Z',
        updatedAt: '2025-08-11T16:45:00Z',
        claimedBy: 'Volunteer Alex',
        deliveredAt: '2025-08-11T16:45:00Z'
      }
    ];

    setTimeout(() => {
      setPantryItems(mockItems);
      setActiveDonations(mockDonations);
      
      // Load active donations from localStorage
      const savedDonations = localStorage.getItem('activeDonations');
      if (savedDonations) {
        setActiveDonations(JSON.parse(savedDonations));
      }
      
      const donationStats = calculateDonationStats(mockDonations);
      
      setStats({
        totalItems: mockItems.length,
        expiringSoon: mockItems.filter(item => {
          const days = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
          return days <= 7 && days >= 0;
        }).length,
        expired: mockItems.filter(item => {
          const days = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
          return days < 0;
        }).length,
        categories: new Set(mockItems.map(item => item.category)).size,
        donations: donationStats
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const calculateDonationStats = (donations) => {
    return {
      available: donations.filter(d => d.status === 'available').length,
      claimed: donations.filter(d => d.status === 'claimed').length,
      inTransit: donations.filter(d => d.status === 'inTransit').length,
      delivered: donations.filter(d => d.status === 'delivered').length
    };
  };

  const handleAddItem = (newItem) => {
    setPantryItems(prevItems => [...prevItems, newItem]);
    updateStats([...pantryItems, newItem]);
    console.log('Added item:', newItem);
  };

  const updateStats = (items) => {
    const donationStats = calculateDonationStats(activeDonations);
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
      categories: new Set(items.map(item => item.category)).size,
      donations: donationStats
    });
  };

  const createDonation = (item, recipient = 'Local Food Bank') => {
    const newDonation = {
      id: `DON-${Date.now()}`,
      itemName: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      status: 'available',
      recipient: recipient,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedPickup: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
    };

    const updatedDonations = [...activeDonations, newDonation];
    setActiveDonations(updatedDonations);
    localStorage.setItem('activeDonations', JSON.stringify(updatedDonations));
    
    // Remove item from pantry
    const updatedItems = pantryItems.filter(pantryItem => pantryItem.id !== item.id);
    setPantryItems(updatedItems);
    updateStats(updatedItems);

    return newDonation;
  };

  const updateDonationStatus = (donationId, newStatus, additionalData = {}) => {
    const updatedDonations = activeDonations.map(donation => {
      if (donation.id === donationId) {
        const updatedDonation = {
          ...donation,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          ...additionalData
        };
        
        if (newStatus === 'claimed' && additionalData.claimedBy) {
          updatedDonation.claimedBy = additionalData.claimedBy;
        }
        
        if (newStatus === 'delivered') {
          updatedDonation.deliveredAt = new Date().toISOString();
        }
        
        return updatedDonation;
      }
      return donation;
    });

    setActiveDonations(updatedDonations);
    localStorage.setItem('activeDonations', JSON.stringify(updatedDonations));
    
    const donationStats = calculateDonationStats(updatedDonations);
    setStats(prevStats => ({
      ...prevStats,
      donations: donationStats
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#48bb78'; // Green
      case 'claimed': return '#ed8936';   // Yellow/Orange
      case 'inTransit': return '#4299e1'; // Blue
      case 'delivered': return '#718096'; // Gray
      default: return '#718096';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'available': return 'Available';
      case 'claimed': return 'Claimed';
      case 'inTransit': return 'In Transit';
      case 'delivered': return 'Delivered';
      default: return 'Unknown';
    }
  };

  const handleDonateExpired = () => {
    const expiredItems = pantryItems.filter(item => {
      const days = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
      return days < 0;
    });
    
    if (expiredItems.length === 0) {
      alert('No expired items to donate!');
      return;
    }
    
    if (window.confirm(`Create donations for ${expiredItems.length} expired item(s)? They will be listed as available for pickup.`)) {
      const createdDonations = expiredItems.map(item => createDonation(item, 'Food Recovery Network'));
      
      alert(`Successfully created ${createdDonations.length} donation listing(s)! 
      
Items are now available for pickup by food recovery organizations. You can track their status in the Donation Tracker.`);
    }
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
                <div className="stat-card available-donations">
                  <div className="stat-icon">🟢</div>
                  <div className="stat-info">
                    <h3>Available</h3>
                    <p className="stat-number">{stats.donations.available}</p>
                  </div>
                </div>
                <div className="stat-card claimed-donations">
                  <div className="stat-icon">�</div>
                  <div className="stat-info">
                    <h3>Claimed</h3>
                    <p className="stat-number">{stats.donations.claimed}</p>
                  </div>
                </div>
                <div className="stat-card transit-donations">
                  <div className="stat-icon">🔵</div>
                  <div className="stat-info">
                    <h3>In Transit</h3>
                    <p className="stat-number">{stats.donations.inTransit}</p>
                  </div>
                </div>
                <div className="stat-card delivered-donations">
                  <div className="stat-icon">⚪</div>
                  <div className="stat-info">
                    <h3>Delivered</h3>
                    <p className="stat-number">{stats.donations.delivered}</p>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="action-section">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                  <button 
                    className="action-card donate-card"
                    onClick={handleDonateExpired}
                    disabled={stats.expired === 0}
                  >
                    <span className="action-icon">📤</span>
                    <span className="action-text">Create Donation Listing</span>
                    {stats.expired > 0 && (
                      <span className="badge">{stats.expired}</span>
                    )}
                  </button>
                  <button 
                    className="action-card"
                    onClick={() => setShowDonationTracker(true)}
                  >
                    <span className="action-icon">📊</span>
                    <span className="action-text">Donation Tracker</span>
                    {(stats.donations.available + stats.donations.claimed + stats.donations.inTransit) > 0 && (
                      <span className="badge">{stats.donations.available + stats.donations.claimed + stats.donations.inTransit}</span>
                    )}
                  </button>
                  <button className="action-card">
                    <span className="action-icon">📱</span>
                    <span className="action-text">Scan Barcode</span>
                  </button>
                  <button className="action-card">
                    <span className="action-icon">�</span>
                    <span className="action-text">View All Items</span>
                  </button>
                  <button className="action-card">
                    <span className="action-icon">�</span>
                    <span className="action-text">Generate Report</span>
                  </button>
                  <button className="action-card">
                    <span className="action-icon">�</span>
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
      
      {/* Donation Tracker Modal */}
      {showDonationTracker && (
        <div className="modal-overlay" onClick={() => setShowDonationTracker(false)}>
          <div className="modal-content donation-tracker" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Real-Time Donation Status Tracker</h2>
              <button 
                className="close-btn"
                onClick={() => setShowDonationTracker(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="status-legend">
                <div className="legend-item">
                  <div className="status-dot" style={{ backgroundColor: getStatusColor('available') }}></div>
                  <span>Available - Ready for pickup</span>
                </div>
                <div className="legend-item">
                  <div className="status-dot" style={{ backgroundColor: getStatusColor('claimed') }}></div>
                  <span>Claimed - Assigned to volunteer</span>
                </div>
                <div className="legend-item">
                  <div className="status-dot" style={{ backgroundColor: getStatusColor('inTransit') }}></div>
                  <span>In Transit - Being delivered</span>
                </div>
                <div className="legend-item">
                  <div className="status-dot" style={{ backgroundColor: getStatusColor('delivered') }}></div>
                  <span>Delivered - Successfully completed</span>
                </div>
              </div>
              
              <div className="donations-list">
                {activeDonations.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">📦</div>
                    <h3>No Active Donations</h3>
                    <p>Create your first donation listing to start tracking!</p>
                  </div>
                ) : (
                  activeDonations
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .map((donation, index) => (
                      <div key={donation.id} style={{ '--delay': index }} className="donation-card">
                        <div className="donation-header">
                          <div className="donation-id">ID: {donation.id}</div>
                          <div 
                            className="status-badge"
                            style={{ 
                              backgroundColor: getStatusColor(donation.status),
                              color: 'white'
                            }}
                          >
                            {getStatusLabel(donation.status)}
                          </div>
                        </div>
                        <div className="donation-info">
                          <div className="donation-item-details">
                            <h4>{donation.itemName}</h4>
                            <div className="item-meta">
                              <span className="category">{donation.category}</span>
                              <span className="quantity">{donation.quantity} {donation.unit}</span>
                            </div>
                          </div>
                          <div className="donation-recipient">
                            <strong>Recipient:</strong> {donation.recipient}
                            {donation.claimedBy && (
                              <div><strong>Volunteer:</strong> {donation.claimedBy}</div>
                            )}
                          </div>
                        </div>
                        <div className="donation-timeline">
                          <div className="timeline-item">
                            <strong>Created:</strong> {new Date(donation.createdAt).toLocaleString()}
                          </div>
                          <div className="timeline-item">
                            <strong>Last Updated:</strong> {new Date(donation.updatedAt).toLocaleString()}
                          </div>
                          {donation.deliveredAt && (
                            <div className="timeline-item">
                              <strong>Delivered:</strong> {new Date(donation.deliveredAt).toLocaleString()}
                            </div>
                          )}
                        </div>
                        {donation.status !== 'delivered' && (
                          <div className="donation-actions">
                            {donation.status === 'available' && (
                              <button 
                                className="btn-status-update"
                                onClick={() => updateDonationStatus(donation.id, 'claimed', { claimedBy: 'Volunteer Demo' })}
                              >
                                Mark as Claimed
                              </button>
                            )}
                            {donation.status === 'claimed' && (
                              <button 
                                className="btn-status-update"
                                onClick={() => updateDonationStatus(donation.id, 'inTransit')}
                              >
                                Mark in Transit
                              </button>
                            )}
                            {donation.status === 'inTransit' && (
                              <button 
                                className="btn-status-update"
                                onClick={() => updateDonationStatus(donation.id, 'delivered')}
                              >
                                Mark as Delivered
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
