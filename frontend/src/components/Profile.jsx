import React, { useState } from 'react';
import './Profile.css';

const Profile = ({ user, onClose, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || user?.name?.split(' ')[0] || '',
    lastName: user?.lastName || user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    location: user?.location || '',
    bio: user?.bio || '',
    notifications: {
      expiryAlerts: user?.notifications?.expiryAlerts ?? true,
      lowStockAlerts: user?.notifications?.lowStockAlerts ?? true,
      emailNotifications: user?.notifications?.emailNotifications ?? true,
      pushNotifications: user?.notifications?.pushNotifications ?? false
    },
    privacy: {
      profileVisibility: user?.privacy?.profileVisibility || 'private',
      shareData: user?.privacy?.shareData ?? false
    },
    preferences: {
      theme: user?.preferences?.theme || 'light',
      language: user?.preferences?.language || 'english',
      dateFormat: user?.preferences?.dateFormat || 'MM/DD/YYYY',
      currency: user?.preferences?.currency || 'USD'
    }
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [category, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
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

    // Simulate API call
    setTimeout(() => {
      const updatedUser = {
        ...user,
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`,
        profileImage
      };
      
      onUpdateUser(updatedUser);
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Handle account deletion
      console.log('Account deletion requested');
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'account', label: 'Account', icon: '🛡️' }
  ];

  return (
    <div className="profile-overlay">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-title">
            <span className="profile-icon">👤</span>
            <h2>Profile Settings</h2>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="profile-content">
          {/* Profile Image Section */}
          <div className="profile-image-section">
            <div className="profile-avatar-large">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="avatar-image" />
              ) : (
                <span className="avatar-text">
                  {formData.firstName?.charAt(0)}{formData.lastName?.charAt(0)}
                </span>
              )}
            </div>
            <div className="image-upload">
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleImageUpload}
                className="image-input"
              />
              <label htmlFor="profileImage" className="upload-btn">
                📷 Change Photo
              </label>
              <p className="upload-hint">JPG, PNG or GIF (max. 5MB)</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="profile-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <form onSubmit={handleSubmit} className="profile-form">
            {activeTab === 'personal' && (
              <div className="tab-content">
                <h3 className="section-title">Personal Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`input-field ${errors.firstName ? 'error' : ''}`}
                      placeholder="Enter first name"
                    />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`input-field ${errors.lastName ? 'error' : ''}`}
                      placeholder="Enter last name"
                    />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`input-field ${errors.email ? 'error' : ''}`}
                      placeholder="Enter email address"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`input-field ${errors.phone ? 'error' : ''}`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="input-field textarea"
                      placeholder="Tell us about yourself..."
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="tab-content">
                <h3 className="section-title">App Preferences</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Theme</label>
                    <select
                      name="preferences.theme"
                      value={formData.preferences.theme}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Language</label>
                    <select
                      name="preferences.language"
                      value={formData.preferences.language}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Date Format</label>
                    <select
                      name="preferences.dateFormat"
                      value={formData.preferences.dateFormat}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Currency</label>
                    <select
                      name="preferences.currency"
                      value={formData.preferences.currency}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="tab-content">
                <h3 className="section-title">Notification Settings</h3>
                <div className="notification-grid">
                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Expiry Alerts</h4>
                      <p>Get notified when items are about to expire</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="notifications.expiryAlerts"
                        checked={formData.notifications.expiryAlerts}
                        onChange={handleInputChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Low Stock Alerts</h4>
                      <p>Get notified when items are running low</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="notifications.lowStockAlerts"
                        checked={formData.notifications.lowStockAlerts}
                        onChange={handleInputChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Email Notifications</h4>
                      <p>Receive notifications via email</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="notifications.emailNotifications"
                        checked={formData.notifications.emailNotifications}
                        onChange={handleInputChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="notification-item">
                    <div className="notification-info">
                      <h4>Push Notifications</h4>
                      <p>Receive push notifications on your device</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="notifications.pushNotifications"
                        checked={formData.notifications.pushNotifications}
                        onChange={handleInputChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="tab-content">
                <h3 className="section-title">Privacy Settings</h3>
                <div className="privacy-grid">
                  <div className="privacy-item">
                    <div className="privacy-info">
                      <h4>Profile Visibility</h4>
                      <p>Control who can see your profile information</p>
                    </div>
                    <select
                      name="privacy.profileVisibility"
                      value={formData.privacy.profileVisibility}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="private">Private</option>
                      <option value="friends">Friends Only</option>
                      <option value="public">Public</option>
                    </select>
                  </div>

                  <div className="privacy-item">
                    <div className="privacy-info">
                      <h4>Share Usage Data</h4>
                      <p>Help improve the app by sharing anonymous usage data</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        name="privacy.shareData"
                        checked={formData.privacy.shareData}
                        onChange={handleInputChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="tab-content">
                <h3 className="section-title">Account Management</h3>
                <div className="account-actions">
                  <div className="action-card">
                    <div className="action-info">
                      <h4>Export Data</h4>
                      <p>Download all your pantry data and settings</p>
                    </div>
                    <button type="button" className="action-btn secondary">
                      📁 Export Data
                    </button>
                  </div>

                  <div className="action-card">
                    <div className="action-info">
                      <h4>Change Password</h4>
                      <p>Update your account password</p>
                    </div>
                    <button type="button" className="action-btn secondary">
                      🔑 Change Password
                    </button>
                  </div>

                  <div className="action-card danger">
                    <div className="action-info">
                      <h4>Delete Account</h4>
                      <p>Permanently delete your account and all data</p>
                    </div>
                    <button 
                      type="button" 
                      className="action-btn danger"
                      onClick={handleDeleteAccount}
                    >
                      🗑️ Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;