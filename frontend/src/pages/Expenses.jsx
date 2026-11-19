import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import axiosClient from '../api/axiosClient';
import {
  Receipt,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Filter,
  DollarSign,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const [formData, setFormData] = useState({
    category: 'Operations',
    amount: '',
    expense_date: new Date().toISOString().slice(0, 10),
    description: '',
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      let url = `/business/expenses/?page=${page}`;
      if (categoryFilter) url += `&category=${categoryFilter}`;
      if (startDate) url += `&start_date=${startDate}`;
      if (endDate) url += `&end_date=${endDate}`;

      const res = await axiosClient.get(url);
      setExpenses(res.data.results || []);
      setTotalCount(res.data.count || 0);
    } catch (err) {
      console.error("Expenses error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [page, categoryFilter, startDate, endDate]);

  const handleOpenAdd = () => {
    setFormData({
      category: 'Operations',
      amount: '',
      expense_date: new Date().toISOString().slice(0, 10),
      description: '',
    });
    setFormError('');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (e) => {
    setSelectedExpense(e);
    setFormData({
      category: e.category,
      amount: e.amount,
      expense_date: e.expense_date,
      description: e.description || '',
    });
    setFormError('');
    setIsEditOpen(true);
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await axiosClient.post('/business/expenses/', formData);
      setIsAddOpen(false);
      fetchExpenses();
    } catch (err) {
      setFormError('Failed to record expense.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await axiosClient.put(`/business/expenses/${selectedExpense.id}/`, formData);
      setIsEditOpen(false);
      fetchExpenses();
    } catch (err) {
      setFormError('Failed to update expense.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense record?")) return;
    try {
      await axiosClient.delete(`/business/expenses/${id}/`);
      fetchExpenses();
    } catch (err) {
      alert("Error deleting expense.");
    }
  };

  const categories = [
    'Office',
    'Marketing',
    'R&D',
    'Operations',
    'Salaries',
    'Logistics',
    'Other'
  ];

  const totalPageExpenses = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

  return (
    <div>
      <Navbar
        title="Operational Expenditures"
        subtitle="Track overhead costs, departmental budgets, and operational outflows"
        actions={
          <button onClick={handleOpenAdd} className="btn-primary">
            <Plus size={16} /> Record Expense
          </button>
        }
      />

      {/* Filter toolbar */}
      <div style={{
        marginTop: '1.25rem',
        marginBottom: '1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.6rem' }}>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="input-field"
            style={{ width: 'auto' }}
          >
            <option value="">All Expense Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field"
              style={{ width: 'auto', fontSize: '0.8rem', padding: '0.45rem 0.6rem' }}
            />
            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field"
              style={{ width: 'auto', fontSize: '0.8rem', padding: '0.45rem 0.6rem' }}
            />
          </div>
        </div>

        <div style={{ fontSize: '0.82rem', color: '#cbd5e1', background: '#0c1222', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
          Page Outflow: <strong style={{ color: '#f43f5e', fontFamily: 'var(--font-mono)' }}>${totalPageExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
        </div>
      </div>

      {/* Table */}
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
                    <th>Date</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount (PKR)</th>
                    <th>Logged By</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((e) => (
                    <tr key={e.id}>
                      <td style={{ fontSize: '0.82rem', color: '#64748b' }}>
                        {e.expense_date}
                      </td>
                      <td>
                        <span className="badge badge-rose">
                          {e.category}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500, color: '#0f172a' }}>
                        {e.description || '-'}
                      </td>
                      <td style={{ fontWeight: 600, color: '#dc2626', fontSize: '0.875rem' }}>
                        -PKR {Number(e.amount).toLocaleString()}
                      </td>
                      <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {e.created_by_email || 'System'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          <button
                            onClick={() => handleOpenEdit(e)}
                            className="btn-secondary"
                            style={{ padding: '0.35rem 0.6rem' }}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(e.id)}
                            className="btn-danger"
                            style={{ padding: '0.35rem 0.6rem' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {expenses.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                        No expense records found.
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
              <div>Showing {expenses.length} of {totalCount} expenses</div>
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
                  disabled={expenses.length < 15}
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

      {/* Add / Edit Expense Modal */}
      <Modal
        isOpen={isAddOpen || isEditOpen}
        onClose={() => {
          setIsAddOpen(false);
          setIsEditOpen(false);
        }}
        title={isAddOpen ? "Record Operational Expense" : "Edit Expense"}
      >
        {formError && (
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.65rem', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '1rem' }}>
            {formError}
          </div>
        )}

        <form onSubmit={isAddOpen ? handleSaveAdd : handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.3rem' }}>
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-field"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginBottom: '0.3rem' }}>
                Amount (PKR) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="45000"
                className="input-field"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.3rem' }}>
                Expense Date *
              </label>
              <input
                type="date"
                required
                value={formData.expense_date}
                onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.3rem' }}>
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Cloud hosting infrastructure bills for Q3..."
              className="input-field"
            />
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
              {saving ? 'Recording...' : 'Save Expense'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Expenses;
