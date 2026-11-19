import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import {
  Building2,
  Users,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  User,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save
} from 'lucide-react';

const Settings = () => {
  const { user, activeCompany, refreshProfile } = useAuth();

  const [companyData, setCompanyData] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Company settings form
  const [compForm, setCompForm] = useState({ name: '', domain: '', industry: '', currency: 'USD' });
  const [compMsg, setCompMsg] = useState('');
  const [compErr, setCompErr] = useState('');
  const [savingComp, setSavingComp] = useState(false);

  // Invite modal
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'EMPLOYEE', first_name: '', last_name: '' });
  const [inviteErr, setInviteErr] = useState('');
  const [inviting, setInviting] = useState(false);

  // Edit role modal
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [newRole, setNewRole] = useState('EMPLOYEE');

  const isAdmin = activeCompany?.role === 'ADMIN';
  const isManagerOrAdmin = activeCompany?.role === 'ADMIN' || activeCompany?.role === 'MANAGER';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [compRes, memRes] = await Promise.all([
        axiosClient.get('/companies/current/'),
        axiosClient.get('/companies/members/'),
      ]);
      setCompanyData(compRes.data);
      setCompForm({
        name: compRes.data.name,
        domain: compRes.data.domain || '',
        industry: compRes.data.industry || 'Technology',
        currency: compRes.data.currency || 'USD',
      });
      setMembers(memRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveCompany = async (e) => {
    e.preventDefault();
    setCompMsg('');
    setCompErr('');
    setSavingComp(true);

    try {
      await axiosClient.put('/companies/current/', compForm);
      setCompMsg('Company organization settings saved!');
      refreshProfile();
      setTimeout(() => setCompMsg(''), 3500);
    } catch (err) {
      setCompErr(err.response?.data?.detail || 'Failed to update company settings.');
    } finally {
      setSavingComp(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteErr('');
    setInviting(true);

    try {
      await axiosClient.post('/companies/members/', inviteForm);
      setIsInviteOpen(false);
      setInviteForm({ email: '', role: 'EMPLOYEE', first_name: '', last_name: '' });
      fetchData();
    } catch (err) {
      setInviteErr(err.response?.data?.detail || err.response?.data?.email?.[0] || 'Failed to add member.');
    } finally {
      setInviting(false);
    }
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/companies/members/${selectedMember.id}/`, { role: newRole });
      setIsRoleModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to change role.');
    }
  };

  const handleRemoveMember = async (id) => {
    if (!window.confirm("Are you sure you want to remove this member from the organization?")) return;
    try {
      await axiosClient.delete(`/companies/members/${id}/`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to remove member.');
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="badge badge-rose"><ShieldAlert size={12} /> Company Admin</span>;
      case 'MANAGER':
        return <span className="badge badge-indigo"><ShieldCheck size={12} /> Manager</span>;
      default:
        return <span className="badge badge-cyan"><User size={12} /> Employee</span>;
    }
  };

  return (
    <div>
      <Navbar
        title="Organization Settings & Team"
        subtitle="Manage tenant profile, subscription tier, and role-based permissions"
        actions={
          isManagerOrAdmin && (
            <button onClick={() => setIsInviteOpen(true)} className="btn-primary">
              <UserPlus size={16} /> Add Team Member
            </button>
          )
        }
      />

      {loading ? (
        <div style={{ display: 'flex', height: '50vh', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
          <Loader2 size={36} className="animate-spin" />
        </div>
      ) : (
        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Top row: Company details & Plan */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(280px, 1fr)', gap: '1.5rem' }}>
            {/* Company profile settings */}
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={20} color="#6366f1" /> Organization Profile
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
                Tenant credentials and global BI reporting configuration
              </p>

              {compMsg && (
                <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} /> {compMsg}
                </div>
              )}

              {compErr && (
                <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1.25rem' }}>
                  {compErr}
                </div>
              )}

              <form onSubmit={handleSaveCompany} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isAdmin}
                    value={compForm.name}
                    onChange={(e) => setCompForm({ ...compForm, name: e.target.value })}
                    className="input-field"
                    style={{ opacity: !isAdmin ? 0.7 : 1 }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Primary Domain
                    </label>
                    <input
                      type="text"
                      disabled={!isAdmin}
                      value={compForm.domain}
                      onChange={(e) => setCompForm({ ...compForm, domain: e.target.value })}
                      placeholder="acmeglobal.io"
                      className="input-field"
                      style={{ opacity: !isAdmin ? 0.7 : 1 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Industry Sector
                    </label>
                    <input
                      type="text"
                      disabled={!isAdmin}
                      value={compForm.industry}
                      onChange={(e) => setCompForm({ ...compForm, industry: e.target.value })}
                      placeholder="Enterprise SaaS"
                      className="input-field"
                      style={{ opacity: !isAdmin ? 0.7 : 1 }}
                    />
                  </div>
                </div>

                {isAdmin && (
                  <button
                    type="submit"
                    disabled={savingComp}
                    className="btn-primary"
                    style={{ width: 'fit-content', marginTop: '0.5rem' }}
                  >
                    <Save size={16} /> {savingComp ? 'Saving...' : 'Save Settings'}
                  </button>
                )}
              </form>
            </div>

            {/* Subscription & Tenant Isolation Status */}
            <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="badge badge-emerald" style={{ marginBottom: '0.85rem' }}>
                  Active Enterprise Subscription
                </span>
                <h4 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                  {companyData?.subscription_plan || 'Enterprise BI'}
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.5rem', lineHeight: 1.5 }}>
                  Full multi-tenant tenant isolation enabled. Includes unlimited CSV dataset processing, real-time Pandas aggregation, and all 3 Scikit-learn predictive engines.
                </p>

                <div style={{ marginTop: '1.5rem', background: '#090d16', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Tenant Isolation Key</div>
                  <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: '#818cf8', marginTop: '0.35rem' }}>
                    {companyData?.id}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '1rem' }}>
                Your current role: <strong style={{ color: '#f8fafc' }}>{activeCompany?.role}</strong>
              </div>
            </div>
          </div>

          {/* Team Members Management Table */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                  Organization Members & Role Hierarchy
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Users authorized to access this company's business data and ML predictions
                </p>
              </div>

              {isManagerOrAdmin && (
                <button onClick={() => setIsInviteOpen(true)} className="btn-primary" style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}>
                  <UserPlus size={14} /> Add User
                </button>
              )}
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="saas-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Email Address</th>
                    <th>Assigned Role</th>
                    <th>Joined Date</th>
                    {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 600, color: '#f8fafc' }}>
                        {m.user_name}
                      </td>
                      <td style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                        {m.user_email}
                      </td>
                      <td>
                        {getRoleBadge(m.role)}
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {new Date(m.joined_at).toLocaleDateString()}
                      </td>
                      {isAdmin && (
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                            <button
                              onClick={() => {
                                setSelectedMember(m);
                                setNewRole(m.role);
                                setIsRoleModalOpen(true);
                              }}
                              className="btn-secondary"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                            >
                              <Edit2 size={13} /> Change Role
                            </button>
                            <button
                              onClick={() => handleRemoveMember(m.id)}
                              className="btn-danger"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                            >
                              <Trash2 size={13} /> Remove
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add / Invite Member Modal */}
      <Modal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Add Team Member to Organization"
      >
        {inviteErr && (
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '1rem' }}>
            {inviteErr}
          </div>
        )}

        <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.35rem' }}>
              Member Work Email *
            </label>
            <input
              type="email"
              required
              value={inviteForm.email}
              onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              placeholder="colleague@company.com"
              className="input-field"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.35rem' }}>
                First Name
              </label>
              <input
                type="text"
                value={inviteForm.first_name}
                onChange={(e) => setInviteForm({ ...inviteForm, first_name: e.target.value })}
                placeholder="Alex"
                className="input-field"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.35rem' }}>
                Last Name
              </label>
              <input
                type="text"
                value={inviteForm.last_name}
                onChange={(e) => setInviteForm({ ...inviteForm, last_name: e.target.value })}
                placeholder="Taylor"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.35rem' }}>
              Role & Access Level *
            </label>
            <select
              value={inviteForm.role}
              onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
              className="input-field"
            >
              <option value="EMPLOYEE">Employee (Read & Standard Operations)</option>
              <option value="MANAGER">Manager (Import, Reports & Operations)</option>
              <option value="ADMIN">Company Admin (Full Permissions & Team)</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.75rem' }}>
            <button type="button" onClick={() => setIsInviteOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={inviting} className="btn-primary">
              {inviting ? 'Adding Member...' : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Change Role Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title={`Change Role: ${selectedMember?.user_name}`}
        maxWidth="460px"
      >
        <form onSubmit={handleUpdateRole} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.35rem' }}>
              Select Role
            </label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="input-field"
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Company Admin</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setIsRoleModalOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Role
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Settings;
