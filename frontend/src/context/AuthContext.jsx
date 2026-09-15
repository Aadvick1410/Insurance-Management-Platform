import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext(null);

export const DEMO_ACCOUNTS = {
  ADMIN: {
    name: 'Admin User',
    email: 'admin@insurance.com',
    password: 'admin123',
    role: 'ROLE_ADMIN',
    description: 'Full administrative access to all reports, policies, claims approval, customers, and financials.'
  },
  AGENT: {
    name: 'Agent Smith',
    email: 'agent@insurance.com',
    password: 'agent123',
    role: 'ROLE_AGENT',
    description: 'Create & manage policies, register customers, review claims, and assist policyholders.'
  },
  CUSTOMER: {
    name: 'John Doe',
    email: 'customer@insurance.com',
    password: 'customer123',
    role: 'ROLE_CUSTOMER',
    description: 'View personal policies, track claim statuses, upload documents, and submit new claims.'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const demoUserStr = localStorage.getItem('demo_user');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Ensure token hasn't expired
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ email: decoded.sub, role: decoded.roles, name: decoded.name || decoded.sub });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    } else if (demoUserStr) {
      try {
        setUser(JSON.parse(demoUserStr));
      } catch (e) {
        localStorage.removeItem('demo_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token } = response.data;
      
      localStorage.removeItem('demo_user');
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const decoded = jwtDecode(token);
      setUser({ email: decoded.sub, role: decoded.roles, name: decoded.name || decoded.sub });
    } catch (error) {
      // If network error (e.g. backend offline during frontend demo preview), check demo accounts
      const matchedDemo = Object.values(DEMO_ACCOUNTS).find(
        acc => acc.email.toLowerCase() === credentials.email.trim().toLowerCase() && acc.password === credentials.password
      );
      if (matchedDemo && (!error.response || error.code === 'ERR_NETWORK')) {
        const demoUser = {
          name: matchedDemo.name,
          email: matchedDemo.email,
          role: matchedDemo.role,
          isDemo: true
        };
        localStorage.setItem('demo_user', JSON.stringify(demoUser));
        setUser(demoUser);
        return;
      }
      throw error;
    }
  };

  const loginAsDemo = (roleKey) => {
    const account = DEMO_ACCOUNTS[roleKey];
    if (account) {
      const demoUser = {
        name: account.name,
        email: account.email,
        role: account.role,
        isDemo: true
      };
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      setUser(demoUser);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('demo_user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginAsDemo, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
