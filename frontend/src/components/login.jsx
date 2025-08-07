import React, { useState } from 'react';
import './login.css';
import { auth } from './firebase'; // Make sure path is correct
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = ({ onLogin, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      setIsLoading(false);
      onLogin({
        email: user.email,
        uid: user.uid
      });
    } catch (err) {
      setIsLoading(false);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="app-logo">
          <div className="logo-icon">🥬</div>
          <h1 className="app-name">FreshTrack</h1>
        </div>
        <p className="app-tagline">
          Keep your pantry fresh and organized
        </p>
      </div>

      <div className="login-card">
        <div className="login-form-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`input-field ${error ? 'error' : ''}`}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`input-field ${error ? 'error' : ''}`}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="forgot-password">
            <a href="#" className="forgot-link">Forgot your password?</a>
          </div>

          <button 
            type="submit" 
            className={`login-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <button onClick={onSwitchToSignup} className="toggle-btn">
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;