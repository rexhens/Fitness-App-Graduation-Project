import React, { createContext, useContext, useState, useEffect } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  apiKey: string | null;
  userId: number | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  apiKey: null,
  userId: null,
  login: async () => false,
  logout: () => {},
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on app start
    const storedApiKey = localStorage.getItem('fittrack_api_key');
    const storedUserId = localStorage.getItem('fittrack_user_id');
    if (storedApiKey && storedUserId) {
      setApiKey(storedApiKey);
      setUserId(Number(storedUserId));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
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
      const receivedApiKey = data.apikey;
      const receivedUserId = data.userid;

      if (receivedApiKey && receivedUserId != null) {
        setApiKey(receivedApiKey);
        setUserId(receivedUserId);
        setIsAuthenticated(true);

        localStorage.setItem('fittrack_api_key', receivedApiKey);
        localStorage.setItem('fittrack_user_id', receivedUserId.toString());

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
    setUserId(null);
    setIsAuthenticated(false);
    localStorage.removeItem('fittrack_api_key');
    localStorage.removeItem('fittrack_user_id');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, apiKey, userId, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
