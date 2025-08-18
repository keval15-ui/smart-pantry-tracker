import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/auth.css';

const Login = () => {
  const { login, signInWithGoogle } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setErrors({}); // Clear any previous errors
      try {
        console.log('Login attempt with:', { email: formData.email });
        const result = await login(formData);
        console.log('Login successful:', result);
        // Navigation will be handled by the auth state change
      } catch (error) {
        console.error('Login error:', error);
        setErrors({ general: error.message || 'Login failed. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrors({}); // Clear any previous errors
    try {
      console.log('Google sign-in attempt...');
      const result = await signInWithGoogle();
      console.log('Google sign-in successful:', result);
      // Navigation will be handled by the auth state change
    } catch (error) {
      console.error('Google sign-in error:', error);
      setErrors({ general: error.message || 'Google sign-in failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container-creative">
      {/* Dynamic Background */}
      <div className="creative-background">
        <div className="gradient-orbs">
          <div 
            className="orb orb-1" 
            style={{
              transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.3}px)`
            }}
          ></div>
          <div 
            className="orb orb-2"
            style={{
              transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * 0.5}px)`
            }}
          ></div>
          <div 
            className="orb orb-3"
            style={{
              transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * -0.4}px)`
            }}
          ></div>
        </div>
        <div className="floating-particles">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i} 
              className={`particle particle-${i % 3 + 1}`}
              style={{ animationDelay: `${i * 0.5}s` }}
            ></div>
          ))}
        </div>
      </div>

      <div className="auth-content-creative">
        {/* Animated Logo Section */}
        <div className="creative-logo-section">
          <div className="logo-container-creative">
            <div className="logo-rings">
              <div className="ring ring-1"></div>
              <div className="ring ring-2"></div>
              <div className="ring ring-3"></div>
            </div>
            <div className="logo-icon-creative">🥬</div>
          </div>
          <div className="brand-info">
            <h1 className="brand-name-creative">Smart Pantry</h1>
            <div className="brand-tagline-creative">Intelligent Kitchen Management</div>
          </div>
        </div>

        {/* Login Card */}
        <div className="auth-card-creative login-card">
          <div className="card-header-creative">
            <div className="welcome-animation">
              <div className="welcome-icon">👋</div>
              <h2 className="welcome-title">Welcome Back</h2>
              <p className="welcome-subtitle">Sign in to continue your smart kitchen journey</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form-creative">
            {errors.general && (
              <div className="error-toast-creative">
                <div className="error-icon">⚠️</div>
                <div className="error-content">
                  <div className="error-title">Login Failed</div>
                  <div className="error-message">{errors.general}</div>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className={`field-group-creative ${focusedField === 'email' ? 'focused' : ''} ${formData.email ? 'filled' : ''} ${errors.email ? 'error' : ''}`}>
              <div className="field-container-creative">
                <div className="field-icon-creative">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  className="field-input-creative"
                  disabled={isLoading}
                  autoComplete="email"
                />
                <label className="field-label-creative">Email Address</label>
                <div className="field-border-creative"></div>
              </div>
              {errors.email && (
                <div className="field-error-creative">
                  <span className="error-dot"></span>
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className={`field-group-creative ${focusedField === 'password' ? 'focused' : ''} ${formData.password ? 'filled' : ''} ${errors.password ? 'error' : ''}`}>
              <div className="field-container-creative">
                <div className="field-icon-creative">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-10 0v-4c0-2.206 1.794-4 4-4s4 1.794 4 4v4h-8z"/>
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  className="field-input-creative"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <label className="field-label-creative">Password</label>
                <button
                  type="button"
                  className="password-toggle-creative"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  )}
                </button>
                <div className="field-border-creative"></div>
              </div>
              {errors.password && (
                <div className="field-error-creative">
                  <span className="error-dot"></span>
                  {errors.password}
                </div>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="forgot-link-creative">
              <Link to="/forgot-password" className="forgot-password-creative">
                <span className="forgot-icon">🔑</span>
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`submit-button-creative login-button ${isLoading ? 'loading' : ''}`}
            >
              <div className="button-background-creative"></div>
              <div className="button-content-creative">
                {isLoading ? (
                  <>
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <div className="button-icon-creative">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M10 17l5-5-5-5v10z"/>
                      </svg>
                    </div>
                    <span>Sign In</span>
                    <div className="button-ripple"></div>
                  </>
                )}
              </div>
            </button>

            {/* Social Login Section */}
            <div className="social-section-creative">
              <div className="social-divider">
                <span>or continue with</span>
              </div>
              <div className="social-buttons-creative">
                <button 
                  type="button" 
                  className="social-btn-creative google"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <div className="social-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  <span>{isLoading ? 'Signing in...' : 'Google'}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="card-footer-creative">
            <div className="signup-prompt">
              <span className="prompt-text">Don't have an account?</span>
              <Link to="/signup" className="signup-link-creative">
                <span className="link-text">Create Account</span>
                <div className="link-arrow">→</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
