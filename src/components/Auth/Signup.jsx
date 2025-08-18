import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { validateEmail, validatePassword, getPasswordStrength } from '../../utils/auth.js';
import '../../styles/auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, signInWithGoogle } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [step, setStep] = useState(1);

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
    
    // Check password strength
    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
        await signup(formData);
        navigate('/dashboard');
      } catch (error) {
        setErrors({ 
          general: error.message || 'Signup failed. Please try again.' 
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrors({});
    try {
      console.log('Google sign-in attempt from signup...');
      const result = await signInWithGoogle();
      console.log('Google sign-in successful:', result);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign-in error:', error);
      setErrors({ general: error.message || 'Google sign-in failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    const stepOneErrors = {};
    if (!formData.name) stepOneErrors.name = 'Full name is required';
    if (!formData.email || !validateEmail(formData.email)) {
      stepOneErrors.email = 'Valid email is required';
    }
    
    if (Object.keys(stepOneErrors).length === 0) {
      setStep(2);
      setErrors({});
    } else {
      setErrors(stepOneErrors);
    }
  };

  const prevStep = () => {
    setStep(1);
    setErrors({});
  };

  return (
    <div className="auth-container-creative">
      {/* Dynamic Background with Different Colors for Signup */}
      <div className="creative-background signup-background">
        <div className="gradient-orbs">
          <div 
            className="orb orb-1 signup-orb" 
            style={{
              transform: `translate(${mousePosition.x * 0.4}px, ${mousePosition.y * 0.6}px)`
            }}
          ></div>
          <div 
            className="orb orb-2 signup-orb"
            style={{
              transform: `translate(${mousePosition.x * -0.5}px, ${mousePosition.y * 0.3}px)`
            }}
          ></div>
          <div 
            className="orb orb-3 signup-orb"
            style={{
              transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * -0.2}px)`
            }}
          ></div>
        </div>
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className={`particle particle-${i % 4 + 1} signup-particle`}
              style={{ animationDelay: `${i * 0.3}s` }}
            ></div>
          ))}
        </div>
      </div>

      <div className="auth-content-creative">
        {/* Animated Logo Section */}
        <div className="creative-logo-section">
          <div className="logo-container-creative">
            <div className="logo-rings signup-rings">
              <div className="ring ring-1"></div>
              <div className="ring ring-2"></div>
              <div className="ring ring-3"></div>
            </div>
            <div className="logo-icon-creative">🥬</div>
          </div>
          <div className="brand-info">
            <h1 className="brand-name-creative">FreshTrack</h1>
            <div className="brand-tagline-creative">Join the Kitchen Revolution</div>
          </div>
        </div>

        {/* Signup Card */}
        <div className="auth-card-creative signup-card">
          {/* Progress Indicator */}
          <div className="signup-progress">
            <div className="progress-steps">
              <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                <div className="step-circle">
                  {step > 1 ? (
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                      <path d="M9 16.17l-4.17-4.17-1.42 1.41 5.59 5.59 12-12-1.41-1.41z"/>
                    </svg>
                  ) : '1'}
                </div>
                <span className="step-label">Personal Info</span>
              </div>
              <div className="progress-line"></div>
              <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-circle">2</div>
                <span className="step-label">Security</span>
              </div>
            </div>
          </div>

          <div className="card-header-creative">
            <div className="signup-animation">
              <div className="signup-icon">✨</div>
              <h2 className="signup-title">
                {step === 1 ? 'Create Account' : 'Secure Your Account'}
              </h2>
              <p className="signup-subtitle">
                {step === 1 ? 'Let\'s get started with your basic information' : 'Create a strong password to protect your account'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="auth-form-creative">
            {errors.general && (
              <div className="error-toast-creative">
                <div className="error-icon">⚠️</div>
                <div className="error-content">
                  <div className="error-title">Signup Failed</div>
                  <div className="error-message">{errors.general}</div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="form-step step-1">
                {/* Name Field */}
                <div className={`field-group-creative ${focusedField === 'name' ? 'focused' : ''} ${formData.name ? 'filled' : ''} ${errors.name ? 'error' : ''}`}>
                  <div className="field-container-creative">
                    <div className="field-icon-creative">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField('')}
                      className="field-input-creative"
                      disabled={isLoading}
                      autoComplete="name"
                    />
                    <label className="field-label-creative">Full Name</label>
                    <div className="field-border-creative"></div>
                  </div>
                  {errors.name && (
                    <div className="field-error-creative">
                      <span className="error-dot"></span>
                      {errors.name}
                    </div>
                  )}
                </div>

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

                <button
                  type="button"
                  onClick={nextStep}
                  className="submit-button-creative signup-button step-button"
                >
                  <div className="button-background-creative"></div>
                  <div className="button-content-creative">
                    <span>Continue</span>
                    <div className="button-icon-creative">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="form-step step-2">
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
                      autoComplete="new-password"
                    />
                    <label className="field-label-creative">Password</label>
                    <button
                      type="button"
                      className="password-toggle-creative"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                          <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7z"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z"/>
                        </svg>
                      )}
                    </button>
                    <div className="field-border-creative"></div>
                  </div>
                  {formData.password && (
                    <div className={`password-strength-creative ${passwordStrength}`}>
                      <div className="strength-bars">
                        <div className="strength-bar"></div>
                        <div className="strength-bar"></div>
                        <div className="strength-bar"></div>
                        <div className="strength-bar"></div>
                      </div>
                      <span className="strength-text">
                        {passwordStrength === 'weak' && '🔴 Weak'}
                        {passwordStrength === 'medium' && '🟡 Medium'}
                        {passwordStrength === 'strong' && '🟢 Strong'}
                      </span>
                    </div>
                  )}
                  {errors.password && (
                    <div className="field-error-creative">
                      <span className="error-dot"></span>
                      {errors.password}
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className={`field-group-creative ${focusedField === 'confirmPassword' ? 'focused' : ''} ${formData.confirmPassword ? 'filled' : ''} ${errors.confirmPassword ? 'error' : ''}`}>
                  <div className="field-container-creative">
                    <div className="field-icon-creative">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M17 7h-3V6a4 4 0 0 0-8 0v1H3a1 1 0 0 0-1 1v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM8 6a2 2 0 0 1 4 0v1H8V6zm5 10a1 1 0 1 1-2 0v-2a1 1 0 1 1 2 0v2z"/>
                      </svg>
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField('')}
                      className="field-input-creative"
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                    <label className="field-label-creative">Confirm Password</label>
                    <button
                      type="button"
                      className="password-toggle-creative"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                          <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5z"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z"/>
                        </svg>
                      )}
                    </button>
                    <div className="field-border-creative"></div>
                  </div>
                  {formData.confirmPassword && formData.password && formData.confirmPassword === formData.password && (
                    <div className="password-match-indicator">
                      <span className="match-icon">✓</span>
                      <span>Passwords match</span>
                    </div>
                  )}
                  {errors.confirmPassword && (
                    <div className="field-error-creative">
                      <span className="error-dot"></span>
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                {/* Step 2 Buttons */}
                <div className="step-buttons">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="back-button-creative"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                    </svg>
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`submit-button-creative signup-button ${isLoading ? 'loading' : ''}`}
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
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <div className="button-icon-creative">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                              <path d="M9 16.17l-4.17-4.17-1.42 1.41 5.59 5.59 12-12-1.41-1.41z"/>
                            </svg>
                          </div>
                          <span>Create Account</span>
                          <div className="button-ripple"></div>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Social Sign-in Section */}
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
                <span>{isLoading ? 'Signing in...' : 'Sign up with Google'}</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="card-footer-creative">
            <div className="login-prompt">
              <span className="prompt-text">Already have an account?</span>
              <Link to="/login" className="login-link-creative">
                <span className="link-text">Sign In</span>
                <div className="link-arrow">→</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
