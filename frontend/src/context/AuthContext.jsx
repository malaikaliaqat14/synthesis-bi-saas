import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [activeCompany, setActiveCompany] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth and load profile on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const res = await axiosClient.get('/auth/profile/');
          setUser(res.data);
          setCompanies(res.data.companies || []);
          
          const storedCompanyId = localStorage.getItem('active_company_id');
          const matchingComp = res.data.companies?.find(c => c.id === storedCompanyId);
          const current = matchingComp || res.data.active_company || res.data.companies?.[0];
          
          if (current) {
            setActiveCompany(current);
            localStorage.setItem('active_company_id', current.id);
          }
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Auth init error:", error);
          localStorage.clear();
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await axiosClient.post('/auth/login/', { email, password });
    const { tokens, user: userData } = res.data;

    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);

    setUser(userData);
    setCompanies(userData.companies || []);

    const comp = userData.active_company || userData.companies?.[0];
    if (comp) {
      setActiveCompany(comp);
      localStorage.setItem('active_company_id', comp.id);
    }

    setIsAuthenticated(true);
    return res.data;
  };

  const register = async (registerData) => {
    const res = await axiosClient.post('/auth/register/', registerData);
    const { tokens, user: userData } = res.data;

    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);

    setUser(userData);
    setCompanies(userData.companies || []);

    const comp = userData.active_company || userData.companies?.[0];
    if (comp) {
      setActiveCompany(comp);
      localStorage.setItem('active_company_id', comp.id);
    }

    setIsAuthenticated(true);
    return res.data;
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        await axiosClient.post('/auth/logout/', { refresh });
      }
    } catch (e) {
      console.warn("Logout error:", e);
    } finally {
      localStorage.clear();
      setUser(null);
      setActiveCompany(null);
      setCompanies([]);
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  };

  const switchCompany = (companyId) => {
    const target = companies.find(c => c.id === companyId);
    if (target) {
      setActiveCompany(target);
      localStorage.setItem('active_company_id', target.id);
      window.location.reload(); // Refresh to re-fetch all tenant scoped APIs
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await axiosClient.get('/auth/profile/');
      setUser(res.data);
      setCompanies(res.data.companies || []);
      if (res.data.active_company) {
        setActiveCompany(res.data.active_company);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeCompany,
        companies,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        switchCompany,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
