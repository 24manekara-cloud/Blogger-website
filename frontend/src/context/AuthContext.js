import React, { createContext, useState, useEffect, useContext } from 'react';
import { getProfile } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('bloggerToken');
      if (token) {
        try {
          const { data } = await getProfile();
          setUser(data);
        } catch (err) {
          localStorage.removeItem('bloggerToken');
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('bloggerToken', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('bloggerToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
