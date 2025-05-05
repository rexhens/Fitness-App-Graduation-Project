// AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  apiKey: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  apiKey: null,
  login: async () => false,
  logout: () => {},
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Login function called with:', email, password);
    setLoading(true);
    try {
      const response = await fetch('https://localhost:7054/Authentication/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        console.error('Login failed:', await response.text());
        return false;
      }

      const data = await response.json();
      const receivedApiKey = data.apiKey;

      if (receivedApiKey) {
        setApiKey(receivedApiKey);
        setIsAuthenticated(true);
        localStorage.setItem('fittrack_api_key', receivedApiKey);
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }

    return false;
  };

  const logout = () => {
    setApiKey(null);
    setIsAuthenticated(false);
    localStorage.removeItem('fittrack_api_key');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, apiKey, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
