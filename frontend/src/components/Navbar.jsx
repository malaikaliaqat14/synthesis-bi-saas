import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Bell, Sparkles } from 'lucide-react';

const Navbar = ({ title, subtitle, actions }) => {
  const { user, activeCompany } = useAuth();

  return (
    <header
      className="app-navbar"
      style={{
        height: '68px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
      }}
    >
      <div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {actions && <div>{actions}</div>}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.85rem',
          borderRadius: '20px',
          background: '#f1f5f9',
          border: '1px solid #e2e8f0',
          color: '#334155',
          fontSize: '0.78rem',
          fontWeight: 600
        }}>
          <span>Analytics</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
