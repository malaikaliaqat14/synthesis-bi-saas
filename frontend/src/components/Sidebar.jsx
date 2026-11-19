import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Receipt,
  UploadCloud,
  TrendingUp,
  BrainCircuit,
  FileSpreadsheet,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Building2,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
  const { user, activeCompany, companies, switchCompany, logout } = useAuth();
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = user?.is_superuser
    ? [
      { label: 'Business Admins', path: '/superadmin', icon: ShieldCheck, badge: 'PRO' },
    ]
    : [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Customers', path: '/customers', icon: Users },
      { label: 'Products', path: '/products', icon: Package },
      { label: 'Orders', path: '/orders', icon: ShoppingCart },
      { label: 'Expenses', path: '/expenses', icon: Receipt },
      { label: 'CSV Import', path: '/import', icon: UploadCloud },
      { label: 'Analytics', path: '/analytics', icon: TrendingUp },
      { label: 'Predict', path: '/ml', icon: BrainCircuit, badge: 'AI' },
      { label: 'Reports', path: '/reports', icon: FileSpreadsheet },
    ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        style={{
          position: 'fixed',
          top: '0.85rem',
          left: '0.85rem',
          zIndex: 60,
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          color: '#0f172a',
          padding: '0.45rem',
          borderRadius: '10px',
          display: 'none',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
        className="mobile-sidebar-toggle"
        aria-label="Toggle Navigation"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="sidebar-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(3px)',
            zIndex: 45
          }}
        />
      )}

      <aside
        className={`app-sidebar ${isMobileOpen ? 'sidebar-open' : ''}`}
        style={{
          width: '260px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          flexShrink: 0
        }}
      >
        {/* Brand Header */}
        <div style={{ padding: '1.1rem 1.25rem', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src="/logo.jpg"
              alt="Synthesis Logo"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                objectFit: 'contain',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', letterSpacing: '-0.02em', color: '#0f172a', lineHeight: 1.2 }}>
                Synthesis
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.02em', marginTop: '2px' }}>
                AI Business Intelligence
              </div>
            </div>
          </div>
        </div>

        {/* Tenant Organization Switcher (Only for Business Admins / Non-Superadmins) */}
        {!user?.is_superuser && (
          <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #f1f5f9', position: 'relative' }}>
            <div
              onClick={() => setShowCompanyMenu(!showCompanyMenu)}
              style={{
                padding: '0.6rem 0.8rem',
                background: '#f8fafc',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
                <Building2 size={16} color="#6366f1" />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {activeCompany ? activeCompany.name : 'Select Company'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#6366f1', fontWeight: 600 }}>
                    Workspace
                  </div>
                </div>
              </div>
              <ChevronDown size={14} color="#64748b" />
            </div>

            {showCompanyMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '1rem',
                right: '1rem',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                zIndex: 60,
                padding: '0.4rem',
                marginTop: '4px'
              }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', padding: '0.4rem 0.6rem', fontWeight: 600 }}>
                  YOUR ORGANIZATIONS
                </div>
                {companies.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      switchCompany(c.id);
                      setShowCompanyMenu(false);
                    }}
                    style={{
                      padding: '0.5rem 0.6rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      color: c.id === activeCompany?.id ? '#6366f1' : '#334155',
                      background: c.id === activeCompany?.id ? '#eef2ff' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>{c.name}</span>
                    <span style={{ fontSize: '0.65rem', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#475569' }}>
                      {c.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Navigation Menu */}
        <nav style={{ flex: 1, padding: '0.85rem 0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#4338ca' : '#475569',
                  background: isActive ? '#eef2ff' : 'transparent',
                  transition: 'all 0.18s ease'
                })}
              >
                <Icon size={18} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: '0.65rem',
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    color: 'white',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    fontWeight: 700
                  }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom User & Logout Card */}
        <div style={{ padding: '0.85rem 1rem', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#e0e7ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#4338ca'
              }}>
                {user?.first_name ? user.first_name[0] : (user?.email ? user.email[0].toUpperCase() : 'U')}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.email}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                  {user?.job_title || 'Authenticated User'}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
