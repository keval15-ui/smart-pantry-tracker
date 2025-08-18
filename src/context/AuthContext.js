import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

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

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified
        };
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // User is signed out
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const { email, password } = credentials;
      
      console.log('🔐 Attempting login for:', email);
      console.log('🔥 Firebase Auth instance:', !!auth);
      console.log('🌐 Firebase Config loaded:', !!auth.app);
      
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      console.log('✅ Login successful:', {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        emailVerified: firebaseUser.emailVerified
      });
      
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified
      };
      
      // The onAuthStateChanged listener will handle setting user state
      return { success: true, user: userData };
    } catch (error) {
      console.error('❌ Login error details:', {
        code: error.code,
        message: error.message,
        customData: error.customData
      });
      
      // Handle specific Firebase auth errors
      let errorMessage = 'Login failed. Please try again.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address. Please check your email or create a new account.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled. Please contact support.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password. Please check your credentials.';
          break;
        case 'auth/missing-password':
          errorMessage = 'Please enter your password.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please choose a stronger password.';
          break;
        default:
          errorMessage = error.message || 'Login failed. Please try again.';
      }
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setIsLoading(true);
      const { name, email, password } = userData;
      
      console.log('🔐 Attempting signup for:', email);
      
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update the user's display name
      await updateProfile(firebaseUser, {
        displayName: name
      });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        name: name,
        email: email,
        createdAt: serverTimestamp(),
        preferences: {
          notifications: {
            expiry: true,
            newItems: false
          },
          defaultLocation: 'Pantry',
          theme: 'light'
        }
      });
      
      const newUserData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: name,
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified
      };
      
      console.log('✅ Signup successful:', newUserData);
      
      // The onAuthStateChanged listener will handle setting user state
      return { success: true, user: newUserData };
    } catch (error) {
      console.error('Signup error:', error);
      
      // Handle specific Firebase auth errors
      let errorMessage = 'Account creation failed. Please try again.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email address already exists.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please choose a stronger password.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Account creation is currently disabled.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
        default:
          errorMessage = error.message || 'Account creation failed. Please try again.';
      }
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // The onAuthStateChanged listener will handle clearing user state
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout. Please try again.');
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      console.log('🔐 Attempting Google sign-in...');
      
      // Create Google Auth Provider
      const provider = new GoogleAuthProvider();
      
      // Add additional scopes if needed
      provider.addScope('email');
      provider.addScope('profile');
      
      // Set custom parameters
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      // Sign in with popup
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      console.log('✅ Google sign-in successful:', {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName
      });
      
      // Check if user document exists, if not create it
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (!userDocSnap.exists()) {
        // Create user document in Firestore for new Google users
        await setDoc(userDocRef, {
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          provider: 'google',
          createdAt: serverTimestamp(),
          preferences: {
            notifications: {
              expiry: true,
              newItems: false
            },
            defaultLocation: 'Pantry',
            theme: 'light'
          }
        });
        console.log('📄 Created new user document for Google user');
      } else {
        console.log('📄 User document already exists');
      }
      
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified,
        provider: 'google'
      };
      
      // The onAuthStateChanged listener will handle setting user state
      return { success: true, user: userData };
    } catch (error) {
      console.error('❌ Google sign-in error:', error);
      
      let errorMessage = 'Google sign-in failed. Please try again.';
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign-in was cancelled. Please try again.';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Pop-up was blocked by your browser. Please allow pop-ups and try again.';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'An account already exists with this email address but with different sign-in credentials.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later.';
          break;
        default:
          errorMessage = error.message || 'Google sign-in failed. Please try again.';
      }
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    signInWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
