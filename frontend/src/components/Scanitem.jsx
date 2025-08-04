import React, { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './scanitem.css';

const ScanItem = ({ onAddItem, onClose }) => {
  const [scanResult, setScanResult] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [itemData, setItemData] = useState({
    barcode: '',
    name: '',
    quantity: 1,
    expiryDate: '',
    category: 'Other',
    location: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scannerRef = useRef(null);
  const html5QrcodeScannerRef = useRef(null);

  const categories = [
    'Dairy', 'Produce', 'Meat', 'Bakery', 'Canned', 'Frozen', 
    'Snacks', 'Beverages', 'Condiments', 'Grains', 'Other'
  ];

  useEffect(() => {
    return () => {
      // Cleanup scanner when component unmounts
      if (html5QrcodeScannerRef.current) {
        html5QrcodeScannerRef.current.clear();
      }
    };
  }, []);

  const startScanning = () => {
    setIsScanning(true);
    setScanResult('');
    
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      supportedScanTypes: [
        Html5QrcodeScanner.SCAN_TYPE_CAMERA,
        Html5QrcodeScanner.SCAN_TYPE_FILE
      ]
    };

    html5QrcodeScannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      config,
      false
    );

    html5QrcodeScannerRef.current.render(onScanSuccess, onScanFailure);
  };

  const stopScanning = () => {
    setIsScanning(false);
    if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.clear();
    }
  };

  const onScanSuccess = async (decodedText, decodedResult) => {
    setScanResult(decodedText);
    setItemData(prev => ({ ...prev, barcode: decodedText }));
    stopScanning();
    
    // Try to fetch product data from barcode
    await fetchProductData(decodedText);
  };

  const onScanFailure = (error) => {
    // Handle scan failure silently or show minimal error
    console.log(`Scan failed: ${error}`);
  };

  const fetchProductData = async (barcode) => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual barcode API
      // Popular APIs: Open Food Facts, UPC Database, etc.
      const response = await mockBarcodeAPI(barcode);
      
      if (response.success) {
        setItemData(prev => ({
          ...prev,
          name: response.data.name || '',
          category: response.data.category || 'Other',
          barcode: barcode
        }));
      } else {
        // If no data found, allow manual entry
        setIsManualEntry(true);
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
      setIsManualEntry(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock API function - replace with real implementation
  const mockBarcodeAPI = async (barcode) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock data based on common barcodes
        const mockData = {
          '012345678901': { name: 'Organic Milk 1L', category: 'Dairy' },
          '123456789012': { name: 'Whole Wheat Bread', category: 'Bakery' },
          '234567890123': { name: 'Fresh Bananas', category: 'Produce' },
          '345678901234': { name: 'Canned Tomatoes', category: 'Canned' }
        };

        if (mockData[barcode]) {
          resolve({ success: true, data: mockData[barcode] });
        } else {
          resolve({ success: false, message: 'Product not found' });
        }
      }, 1000);
    });
  };

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
      barcode: '',
      name: '',
      quantity: 1,
      expiryDate: '',
      category: 'Other',
      location: '',
      notes: ''
    });
    setScanResult('');
    setIsManualEntry(false);
    setErrors({});
  };

  return (
    <div className="scan-overlay">
      <div className="scan-container">
        <div className="scan-header">
          <div className="scan-title">
            <span className="scan-icon">📱</span>
            <h2>Add New Item</h2>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="scan-content">
          {!scanResult && !isManualEntry && (
            <div className="scan-options">
              <div className="scan-method-card">
                <div className="method-icon">📷</div>
                <h3>Scan Barcode</h3>
                <p>Use your camera to scan product barcode</p>
                <button 
                  className="method-btn primary" 
                  onClick={startScanning}
                  disabled={isScanning}
                >
                  {isScanning ? 'Scanning...' : 'Start Scanner'}
                </button>
              </div>

              <div className="divider">
                <span>or</span>
              </div>

              <div className="scan-method-card">
                <div className="method-icon">✍️</div>
                <h3>Manual Entry</h3>
                <p>Add item details manually</p>
                <button 
                  className="method-btn secondary" 
                  onClick={() => setIsManualEntry(true)}
                >
                  Enter Manually
                </button>
              </div>
            </div>
          )}

          {isScanning && (
            <div className="scanner-section">
              <div className="scanner-container">
                <div id="qr-reader"></div>
                <div className="scanner-overlay">
                  <div className="scanner-frame"></div>
                  <p className="scanner-instruction">
                    Position the barcode within the frame
                  </p>
                </div>
              </div>
              <button className="stop-scan-btn" onClick={stopScanning}>
                Stop Scanner
              </button>
            </div>
          )}

          {(scanResult || isManualEntry) && (
            <div className="item-form-section">
              {scanResult && (
                <div className="scan-success">
                  <div className="success-icon">✅</div>
                  <p>Barcode scanned successfully!</p>
                  <code className="barcode-display">{scanResult}</code>
                </div>
              )}

              {isLoading && (
                <div className="loading-section">
                  <div className="loading-spinner"></div>
                  <p>Looking up product information...</p>
                </div>
              )}

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
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanItem;