"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          if (userData.isLoggedIn && userData.token) {
            setUser(userData);
          } else {
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  const updateUserData = (newData) => {
    if (user) {
      const updatedUser = {
        ...user,
        userData: {
          ...user.userData,
          ...newData
        }
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const isAuthenticated = !!user?.isLoggedIn;

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      updateUserData, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 