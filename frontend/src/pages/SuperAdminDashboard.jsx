import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import axiosClient from '../api/axiosClient';
import {
  Building2,
  Users,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Loader2,
  RefreshCw,
  Search,
  MailCheck,
  Send,
  Trash2,
  Eye,
  Globe
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Selected company for customer inspection modal
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  // Register Admin Form state
  const [formData, setFormData] = useState({
    company_name: '',
    email: '',
    first_name: '',
    last_name: '',
    industry: '',
  });
  const [registering, setRegistering] = useState(false);
  const [regSuccess, setRegSuccess] = useState(null);
  const [regError, setRegError] = useState('');
  const [copied, setCopied] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchOverview = async () => {
    try {
      setRefreshing(true);
      const res = await axiosClient.get('/companies/superadmin/overview/');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess(null);
    setRegistering(true);

    try {
      const res = await axiosClient.post('/companies/superadmin/register-admin/', formData);
      setRegSuccess(res.data);
      setFormData({
        company_name: '',
        email: '',
        first_name: '',
        last_name: '',
        industry: '',
      });
      fetchOverview();
    } catch (err) {
      setRegError(err.response?.data?.detail || 'Failed to register company admin.');
    } finally {
      setRegistering(false);
    }
  };

  const copyToClipboard = (text) => {
    const fullUrl = text.startsWith('http') ? text : `${window.location.origin}${text}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDeleteCompany = async (companyId, companyName) => {
    if (!window.confirm(`Are you sure you want to remove "${companyName}" and its business admin? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(companyId);
    try {
      await axiosClient.delete(`/companies/superadmin/companies/${companyId}/`);
      fetchOverview();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete business.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewCustomers = (company) => {
    setSelectedCompany(company);
    setIsCustomerModalOpen(true);
  };

  const filteredCompanies = data?.companies?.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.admin_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.admin_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div>
      <Navbar
        title="Super Admin Portal"
        subtitle="Manage business administrators and send activation invitations"
        actions={
          <button
            onClick={fetchOverview}
            disabled={refreshing}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '0.45rem 0.8rem' }}
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        }
      />

      {loading ? (
        <div style={{ display: 'flex', height: '300px', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
          <Loader2 size={36} className="animate-spin" />
        </div>
      ) : (
        <div style={{ marginTop: '1.25rem' }}>
          {/* Top KPI - Only Total Business Admins */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 360px)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Registered Business Admins
                </span>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                  <Users size={20} />
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.4rem', letterSpacing: '-0.02em' }}>
                {data?.total_admins || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginTop: '0.25rem' }}>
                Active business accounts
              </div>
            </div>
          </div>

          {/* Provision Form & Businesses Directory */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1fr) minmax(360px, 1.8fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Form */}
            <div className="glass-panel" style={{ padding: '1.75rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <UserPlus size={20} color="#4f46e5" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Register Business Admin</h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem' }}>
                Enter the business details and admin email. The system automatically sends an invitation link to the admin's email so they can set their password and log in.
              </p>

              {regError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecdd3', color: '#dc2626', padding: '0.75rem', borderRadius: '10px', fontSize: '0.82rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={16} /> {regError}
                </div>
              )}

              {regSuccess && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.1rem', borderRadius: '12px', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                    <CheckCircle2 size={18} /> {regSuccess.message}
                  </div>
                  
                  {regSuccess.email_sent ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#15803d', fontSize: '0.78rem', fontWeight: 600, marginTop: '0.5rem' }}>
                      <MailCheck size={16} /> Activation invitation email delivered to <strong>{regSuccess.admin.email}</strong>
                    </div>
                  ) : (
                    <div style={{ color: '#b45309', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                      Notice: Email queued to {regSuccess.admin.email} ({regSuccess.email_error || 'console backend'}).
                    </div>
                  )}

                  <p style={{ fontSize: '0.78rem', color: '#166534', marginTop: '0.5rem' }}>
                    Company: <strong>{regSuccess.company.name}</strong> • Industry: <strong>{regSuccess.company.industry}</strong>
                  </p>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Company / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    placeholder="e.g. Zara Clothing Brand"
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Business Admin Email * (Invitation Sent Here)
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="admin@brand.com"
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Industry * (Enter Custom Industry)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g. Clothing & Apparel, Fast Fashion, Footwear, etc."
                    className="input-field"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Admin First Name
                    </label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      placeholder="Jane"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Admin Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      placeholder="Doe"
                      className="input-field"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={registering}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.75rem' }}
                >
                  <Send size={15} />
                  {registering ? 'Registering & Sending Email...' : 'Register Admin & Send Email Invitation'}
                </button>
              </form>
            </div>

            {/* Registered Businesses Admins Directory */}
            <div className="glass-panel" style={{ padding: '1.75rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Business Administrators Directory</h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>All registered businesses and their admin accounts</p>
                </div>
                <div style={{ position: 'relative', width: '220px' }}>
                  <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search brand, email, or admin..."
                    className="input-field"
                    style={{ paddingLeft: '2.2rem', padding: '0.45rem 0.65rem 0.45rem 2.2rem', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="saas-table">
                  <thead>
                    <tr>
                      <th>Business Name</th>
                      <th>Admin Name</th>
                      <th>Admin Email</th>
                      <th>Industry</th>
                      <th>Customers</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompanies.map((c) => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 600, color: '#0f172a' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Building2 size={16} color="#4f46e5" />
                            {c.name}
                          </div>
                        </td>
                        <td style={{ color: '#334155', fontWeight: 500 }}>{c.admin_name}</td>
                        <td style={{ color: '#4338ca', fontWeight: 600 }}>{c.admin_email}</td>
                        <td>
                          <span style={{ background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 500 }}>
                            {c.industry}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleViewCustomers(c)}
                            className="btn-secondary"
                            style={{
                              padding: '0.3rem 0.65rem',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              borderColor: '#c7d2fe',
                              background: '#eef2ff',
                              color: '#4338ca'
                            }}
                          >
                            <Users size={13} />
                            {c.customer_count || 0} Customers
                          </button>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            <button
                              type="button"
                              onClick={() => handleViewCustomers(c)}
                              title="View customers of this business"
                              className="btn-secondary"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                            >
                              <Eye size={13} />
                              View
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCompany(c.id, c.name)}
                              disabled={deletingId === c.id}
                              title="Remove business and admin"
                              className="btn-danger"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                            >
                              <Trash2 size={13} />
                              {deletingId === c.id ? 'Removing...' : 'Remove'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredCompanies.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                          No business administrators registered yet. Use the form on the left to add one!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Customers Inspection Modal */}
      <Modal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        title={selectedCompany ? `${selectedCompany.name} — Customer Accounts` : 'Customer Accounts'}
        maxWidth="750px"
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Admin: <strong style={{ color: '#0f172a' }}>{selectedCompany?.admin_name}</strong> ({selectedCompany?.admin_email})
              </div>
              <div style={{ fontSize: '0.8rem', color: '#4f46e5', fontWeight: 600, marginTop: '2px' }}>
                Industry: {selectedCompany?.industry}
              </div>
            </div>
            <span className="badge badge-indigo">
              {selectedCompany?.customers?.length || 0} Registered Customer(s)
            </span>
          </div>

          <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
            {selectedCompany?.customers && selectedCompany.customers.length > 0 ? (
              <table className="saas-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Email</th>
                    <th>City / Region</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCompany.customers.map((cust) => (
                    <tr key={cust.id}>
                      <td style={{ fontWeight: 600, color: '#0f172a' }}>{cust.name}</td>
                      <td style={{ color: '#475569', fontSize: '0.82rem' }}>{cust.email}</td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#334155' }}>
                          <Globe size={13} color="#6366f1" />
                          {cust.city} • {cust.region}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${cust.is_active ? 'badge-emerald' : 'badge-rose'}`}>
                          {cust.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#64748b' }}>
                <Users size={32} style={{ margin: '0 auto 0.75rem auto', color: '#94a3b8' }} />
                <p style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>No Customers Registered Yet</p>
                <p style={{ fontSize: '0.8rem' }}>When this company admin imports their orders or adds customers, they will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SuperAdminDashboard;
