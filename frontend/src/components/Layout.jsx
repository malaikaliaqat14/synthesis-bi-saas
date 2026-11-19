import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        <main className="app-main-content" style={{ flex: 1, padding: '1.75rem 2rem 3rem 2rem' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
