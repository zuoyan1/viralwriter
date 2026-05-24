import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  login as loginApi,
  register as registerApi,
  getUserInfo,
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  setUserInfo,
  getUserInfoFromStorage,
  removeUserInfo,
  AuthResponse,
} from '../api/authApi';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      const storedUser = getUserInfoFromStorage();

      if (token && storedUser) {
        try {
          const userInfo = await getUserInfo();
          setUser(userInfo);
        } catch (error) {
          removeAuthToken();
          removeUserInfo();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginApi({ email, password });
    setAuthToken(response.token);
    setUserInfo(response.user);
    setUser(response.user);
  };

  const register = async (email: string, password: string, name?: string) => {
    const response = await registerApi({ email, password, name });
    setAuthToken(response.token);
    setUserInfo(response.user);
    setUser(response.user);
  };

  const logout = () => {
    removeAuthToken();
    removeUserInfo();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
