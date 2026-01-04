import React, { createContext, useContext, useState, useEffect } from 'react';
import {AuthService} from "../services/auth/authService";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role_name: string;
  active: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // DEMO MODE: always logged in as admin
  const demoAdmin: User = {
    id: 'DBG001',
    first_name: 'Debug',
    last_name: 'Admin',
    email: 'debug_admin@enerlink.com',
    role_name: 'Administrator',
    active: true,
  };
  const [user, setUser] = useState<User | null>(demoAdmin);
  const [token, setToken] = useState<string | null>('demo-token');
  const [isLoading, setIsLoading] = useState(false);

  // login/logout do nothing in demo mode
  const login = async () => true;
  const logout = () => {};

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};