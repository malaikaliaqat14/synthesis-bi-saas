import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import axiosClient from '../api/axiosClient';
import {
  Package,
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Tag,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [lowStockFilter, setLowStockFilter] = useState(false);
  const [page, setPage] = useState(1);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    unit_price: '',
    unit_cost: '',
    stock_quantity: 50,
    reorder_level: 10,
    description: '',
  });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await axiosClient.get('/business/categories/');
      setCategories(res.data.results || []);
    } catch (e) {
      console.error("Categories fetch error:", e);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = `/business/products/?page=${page}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (categoryFilter) url += `&category=${categoryFilter}`;
      if (lowStockFilter) url += `&low_stock=true`;

      const res = await axiosClient.get(url);
      setProducts(res.data.results || []);
      setTotalCount(res.data.count || 0);
    } catch (err) {
      console.error("Products error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, categoryFilter, lowStockFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      sku: `SKU-PRD-${Math.floor(1000 + Math.random() * 9000)}`,
      category: categories[0]?.id || '',
      unit_price: '',
      unit_cost: '',
      stock_quantity: 50,
      reorder_level: 15,
      description: '',
    });
    setFormError('');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (p) => {
    setSelectedProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      category: p.category || '',
      unit_price: p.unit_price,
      unit_cost: p.unit_cost,
      stock_quantity: p.stock_quantity,
      reorder_level: p.reorder_level,
      description: p.description || '',
    });
    setFormError('');
    setIsEditOpen(true);
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await axiosClient.post('/business/products/', formData);
      setIsAddOpen(false);
      fetchProducts();
    } catch (err) {
      setFormError('Failed to save product. SKU might already exist.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await axiosClient.put(`/business/products/${selectedProduct.id}/`, formData);
      setIsEditOpen(false);
      fetchProducts();
    } catch (err) {
      setFormError('Failed to update product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this product?")) return;
    try {
      await axiosClient.delete(`/business/products/${id}/`);
      fetchProducts();
    } catch (err) {
      alert("Error deleting product.");
    }
  };

  return (
    <div>
      <Navbar
        title="Products & Inventory"
        subtitle="Manage product catalog pricing, unit margins, and inventory thresholds"
        actions={
          <button onClick={handleOpenAdd} className="btn-primary">
            <Plus size={16} /> Add Product
          </button>
        }
      />

      {/* Toolbar */}
      <div style={{
        marginTop: '1.25rem',
        marginBottom: '1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem'
      }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '380px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} color="#64748b" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name or SKU..."
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
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="input-field"
            style={{ width: 'auto' }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#cbd5e1', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={lowStockFilter}
              onChange={(e) => {
                setLowStockFilter(e.target.checked);
                setPage(1);
              }}
              style={{ accentColor: '#6366f1' }}
            />
            Low Stock Alerts
          </label>
        </div>
      </div>

      {/* Products Table */}
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
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price (PKR)</th>
                    <th>Cost (PKR)</th>
                    <th>Margin</th>
                    <th>Stock</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const isLow = p.stock_quantity <= p.reorder_level;
                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{p.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>{p.sku}</div>
                        </td>
                        <td>
                          <span className="badge badge-indigo">
                            <Tag size={12} /> {p.category_name || 'General'}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#0f172a' }}>
                          PKR {Number(p.unit_price).toLocaleString()}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', color: '#64748b' }}>
                          PKR {Number(p.unit_cost).toLocaleString()}
                        </td>
                        <td>
                          <span style={{ fontWeight: 700, color: p.profit_margin >= 40 ? '#059669' : '#d97706', fontSize: '0.82rem' }}>
                            {p.profit_margin}%
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${isLow ? 'badge-rose' : 'badge-emerald'}`}>
                            {isLow && <AlertCircle size={12} />}
                            {p.stock_quantity} units {isLow && '(Reorder)'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                            <button
                              onClick={() => handleOpenEdit(p)}
                              title="Edit Product"
                              className="btn-secondary"
                              style={{ padding: '0.35rem 0.6rem' }}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              title="Deactivate Product"
                              className="btn-danger"
                              style={{ padding: '0.35rem 0.6rem' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                        No product items found.
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
              <div>Showing {products.length} of {totalCount} products</div>
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
                  disabled={products.length < 15}
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

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isAddOpen || isEditOpen}
        onClose={() => {
          setIsAddOpen(false);
          setIsEditOpen(false);
        }}
        title={isAddOpen ? "Add New Product" : `Edit Product - ${selectedProduct?.name}`}
      >
        {formError && (
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.65rem', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '1rem' }}>
            {formError}
          </div>
        )}

        <form onSubmit={isAddOpen ? handleSaveAdd : handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.3rem' }}>
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Cloud Server Pro"
              className="input-field"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.3rem' }}>
                SKU Identifier *
              </label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="SKU-CLD-001"
                className="input-field"
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.3rem' }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginBottom: '0.3rem' }}>
                Unit Sale Price (PKR) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.unit_price}
                onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                placeholder="25000"
                className="input-field"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginBottom: '0.3rem' }}>
                Unit Cost (COGS PKR) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.unit_cost}
                onChange={(e) => setFormData({ ...formData, unit_cost: e.target.value })}
                placeholder="9000"
                className="input-field"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.3rem' }}>
                Stock Quantity
              </label>
              <input
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                className="input-field"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.3rem' }}>
                Reorder Threshold
              </label>
              <input
                type="number"
                value={formData.reorder_level}
                onChange={(e) => setFormData({ ...formData, reorder_level: parseInt(e.target.value) || 0 })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.3rem' }}>
              Description
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enterprise service specifications..."
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
              {saving ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
