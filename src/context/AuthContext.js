import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (savedUser && token) {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      // Simulate API call
      console.log('Logging in with:', credentials);
      
      // Mock authentication - replace with real API call
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: credentials.email
      };
      
      const mockToken = 'mock-jwt-token';
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', mockToken);
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    }
  };

  const signup = async (userData) => {
    try {
      // Simulate API call
      console.log('Signing up with:', userData);
      
      // Mock registration - replace with real API call
      const mockUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email
      };
      
      const mockToken = 'mock-jwt-token';
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', mockToken);
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error('Signup failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
