import React, { createContext, useState, useContext } from 'react';

const COOKIE_NAME = 'userData';

const readCookie = () => {
  const value = document.cookie.split('; ').find((p) => p.startsWith(`${COOKIE_NAME}=`));
  if (!value) return null;

  try {
    return JSON.parse(decodeURIComponent(value.slice(COOKIE_NAME.length + 1)));
  } catch {
    return null;
  }
};

const writeCookie = (userData) => {
  const payload = userData.token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  const { exp } = JSON.parse(atob(payload));
  const maxAge = exp - Math.floor(Date.now() / 1000);
  const value = encodeURIComponent(JSON.stringify(userData));
  document.cookie = `${COOKIE_NAME}=${value}; max-age=${maxAge}; path=/; samesite=strict`;
};

const clearCookie = () => {
  document.cookie = `${COOKIE_NAME}=; max-age=0; path=/; samesite=strict`;
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readCookie);

  const login = (userData) => {
    setUser(userData);
    writeCookie(userData);
  };

  const logout = () => {
    setUser(null);
    clearCookie();
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
