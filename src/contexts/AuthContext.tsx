import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authService} from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  isVerified: boolean;
  joinDate: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, phone: string) => Promise<void>;
  signOut: () => Promise<void>;
  verifyAccount: (code: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');

      if (token && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authService.signIn(email, password);
      const {user: userData, token} = response;

      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, phone: string) => {
    try {
      const response = await authService.signUp(email, password, name, phone);
      const {user: userData, token} = response;

      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const verifyAccount = async (code: string) => {
    try {
      const response = await authService.verifyAccount(code);
      if (user) {
        const updatedUser = {...user, isVerified: true};
        setUser(updatedUser);
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      }
    } catch (error) {
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (user) {
        const updatedUser = {...user, ...userData};
        setUser(updatedUser);
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Update user failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        signIn,
        signUp,
        signOut,
        verifyAccount,
        updateUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};