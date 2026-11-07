import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider, signInWithPopup, signOut } from '../firebase/config';
import { isAuthorizedAdmin } from '../utils/shopLogic';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<User | null>;
  logout: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  signInWithGoogle: async () => null,
  logout: async () => {},
  authError: null,
  clearAuthError: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = isAuthorizedAdmin(user?.email);

  const signInWithGoogle = async (): Promise<User | null> => {
    try {
      setAuthError(null);
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google authentication failed';
      console.error('Google Sign-In Error:', err);
      setAuthError(msg);
      return null;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setAuthError(null);
    } catch (err) {
      console.error('Sign-Out Error:', err);
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        signInWithGoogle,
        logout,
        authError,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
