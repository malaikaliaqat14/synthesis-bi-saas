import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import axiosClient from '../api/axiosClient';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Globe,
  Mail,
  Phone,
  Building,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [page, setPage] = useState(1);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'United States',
    postal_code: '',
    region: 'North America',
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      let url = `/business/customers/?page=${page}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (regionFilter) url += `&region=${encodeURIComponent(regionFilter)}`;

      const res = await axiosClient.get(url);
      setCustomers(res.data.results || []);
      setTotalCount(res.data.count || 0);
    } catch (err) {
      console.error("Customers error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, regionFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCustomers();
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      country: 'United States',
      postal_code: '',
      region: 'North America',
    });
    setFormError('');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (c) => {
    setSelectedCustomer(c);
    setFormData({
      name: c.name,
      email: c.email,
      phone: c.phone || '',
      address: c.address || '',
      city: c.city || '',
      state: c.state || '',
      country: c.country || 'United States',
      postal_code: c.postal_code || '',
      region: c.region || 'North America',
    });
    setFormError('');
    setIsEditOpen(true);
  };

  const handleOpenDetail = (c) => {
    setSelectedCustomer(c);
    setIsDetailOpen(true);
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await axiosClient.post('/business/customers/', formData);
      setIsAddOpen(false);
      fetchCustomers();
    } catch (err) {
      setFormError(err.response?.data?.email?.[0] || 'Failed to create customer.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await axiosClient.put(`/business/customers/${selectedCustomer.id}/`, formData);
      setIsEditOpen(false);
      fetchCustomers();
    } catch (err) {
      setFormError('Failed to update customer details.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this customer?")) return;
    try {
      await axiosClient.delete(`/business/customers/${id}/`);
      fetchCustomers();
    } catch (err) {
      alert("Error deleting customer.");
    }
  };

  return (
    <div>
      <Navbar
        title="Customer Directory"
        subtitle="Manage customer relationships, geographic profiles, and purchase history"
        actions={
          <button onClick={handleOpenAdd} className="btn-primary">
            <Plus size={16} /> Add Customer
          </button>
        }
      />

      {/* Filter and Search Bar */}
      <div style={{
        marginTop: '1.25rem',
        marginBottom: '1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem'
      }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '400px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, email, phone..."
              className="input-field"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <button type="submit" className="btn-secondary" style={{ padding: '0 0.9rem' }}>
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <select
            value={regionFilter}
            onChange={(e) => {
              setRegionFilter(e.target.value);
              setPage(1);
            }}
            className="input-field"
            style={{ width: 'auto' }}
          >
            <option value="">All Regions / Provinces</option>
            <option value="Punjab">Punjab</option>
            <option value="Sindh">Sindh</option>
            <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
            <option value="Balochistan">Balochistan</option>
            <option value="Islamabad Capital">Islamabad Capital</option>
            <option value="Asia-Pacific">Asia-Pacific</option>
            <option value="Middle East & Africa">Middle East & Africa</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', height: '300px', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table className="saas-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Region</th>
                    <th>Contact Info</th>
                    <th>Orders</th>
                    <th>Lifetime Spent</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ fontWeight: 500, color: '#0f172a', fontSize: '0.84rem' }}>{c.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '1px' }}>
                          {c.city ? `${c.city}, ${c.country}` : (c.country || 'Pakistan')}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-indigo" style={{ fontWeight: 500 }}>
                          <Globe size={11} /> {c.region}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.78rem', color: '#334155' }}>{c.email}</div>
                        {c.phone && <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{c.phone}</div>}
                      </td>
                      <td style={{ fontWeight: 500, color: '#0f172a' }}>{c.total_orders}</td>
                      <td style={{ fontWeight: 600, color: '#059669', fontSize: '0.85rem' }}>
                        PKR {Number(c.total_spent || 0).toLocaleString()}
                      </td>
                      <td>
                        <span className={`badge ${c.is_active ? 'badge-emerald' : 'badge-rose'}`}>
                          {c.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          <button
                            onClick={() => handleOpenDetail(c)}
                            title="View Customer"
                            className="btn-secondary"
                            style={{ padding: '0.35rem 0.6rem' }}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(c)}
                            title="Edit Customer"
                            className="btn-secondary"
                            style={{ padding: '0.35rem 0.6rem' }}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            title="Deactivate Customer"
                            className="btn-danger"
                            style={{ padding: '0.35rem 0.6rem' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                        No customer accounts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              fontSize: '0.82rem',
              color: '#94a3b8'
            }}>
              <div>
                Showing {customers.length} of {totalCount} customers
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="btn-secondary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                <span style={{ display: 'flex', alignItems: 'center', padding: '0 0.5rem', fontWeight: 600, color: '#f8fafc' }}>
                  Page {page}
                </span>
                <button
                  disabled={customers.length < 15}
                  onClick={() => setPage(page + 1)}
                  className="btn-secondary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add / Edit Customer Modal */}
      <Modal
        isOpen={isAddOpen || isEditOpen}
        onClose={() => {
          setIsAddOpen(false);
          setIsEditOpen(false);
        }}
        title={isAddOpen ? "Add New Customer" : `Edit Customer - ${selectedCustomer?.name}`}
      >
        {formError && (
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.65rem', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '1rem' }}>
            {formError}
          </div>
        )}

        <form onSubmit={isAddOpen ? handleSaveAdd : handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.3rem' }}>
              Customer / Organization Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Apex Capital Inc"
              className="input-field"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.3rem' }}>
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@company.com"
                className="input-field"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.3rem' }}>
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1-555-0199"
                className="input-field"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.3rem' }}>
                Geographical Region *
              </label>
              <select
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="input-field"
              >
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="Asia-Pacific">Asia-Pacific</option>
                <option value="Latin America">Latin America</option>
                <option value="Middle East & Africa">Middle East & Africa</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.3rem' }}>
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="New York"
                className="input-field"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={() => {
                setIsAddOpen(false);
                setIsEditOpen(false);
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save Customer'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Customer Details Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Customer Profile & Metrics"
      >
        {selectedCustomer && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontWeight: 700, fontSize: '1.1rem' }}>
                {selectedCustomer.name[0]}
              </div>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a' }}>{selectedCustomer.name}</h4>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>ID: #{selectedCustomer.id} • Joined {new Date(selectedCustomer.created_at).toLocaleDateString()}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>Total Orders</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginTop: '0.25rem' }}>{selectedCustomer.total_orders}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>Lifetime Value (CLV)</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#059669', marginTop: '0.25rem' }}>
                  PKR {Number(selectedCustomer.total_spent || 0).toLocaleString()}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem', color: '#334155', background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div><strong style={{ color: '#64748b', minWidth: '70px', display: 'inline-block' }}>Email:</strong> {selectedCustomer.email}</div>
              <div><strong style={{ color: '#64748b', minWidth: '70px', display: 'inline-block' }}>Phone:</strong> {selectedCustomer.phone || 'N/A'}</div>
              <div><strong style={{ color: '#64748b', minWidth: '70px', display: 'inline-block' }}>Region:</strong> {selectedCustomer.region}</div>
              <div><strong style={{ color: '#64748b', minWidth: '70px', display: 'inline-block' }}>Location:</strong> {selectedCustomer.city || '-'}, {selectedCustomer.country}</div>
              <div><strong style={{ color: '#64748b', minWidth: '70px', display: 'inline-block' }}>Address:</strong> {selectedCustomer.address || '-'}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Customers;
