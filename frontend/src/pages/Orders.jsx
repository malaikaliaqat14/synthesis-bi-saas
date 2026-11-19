import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import axiosClient from '../api/axiosClient';
import {
  ShoppingCart,
  Search,
  Plus,
  Eye,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Order creation form state
  const [orderCustomer, setOrderCustomer] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().slice(0, 16));
  const [orderNotes, setOrderNotes] = useState('');
  const [orderItems, setOrderItems] = useState([
    { product: '', quantity: 1, unit_price: 0, subtotal: 0 }
  ]);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchAuxData = async () => {
    try {
      const [custRes, prodRes] = await Promise.all([
        axiosClient.get('/business/customers/?page_size=100'),
        axiosClient.get('/business/products/?page_size=100'),
      ]);
      setCustomers(custRes.data.results || []);
      setProducts(prodRes.data.results || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let url = `/business/orders/?page=${page}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (statusFilter) url += `&status=${statusFilter}`;

      const res = await axiosClient.get(url);
      setOrders(res.data.results || []);
      setTotalCount(res.data.count || 0);
    } catch (err) {
      console.error("Orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuxData();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const handleOpenCreate = () => {
    setOrderCustomer(customers[0]?.id || '');
    setOrderDate(new Date().toISOString().slice(0, 16));
    setOrderNotes('');
    setOrderItems([
      {
        product: products[0]?.id || '',
        quantity: 1,
        unit_price: products[0]?.unit_price || 0,
        subtotal: products[0]?.unit_price || 0
      }
    ]);
    setFormError('');
    setIsCreateOpen(true);
  };

  const handleProductChange = (index, prodId) => {
    const prod = products.find(p => p.id === parseInt(prodId));
    const price = prod ? parseFloat(prod.unit_price) : 0;
    const items = [...orderItems];
    items[index].product = prodId;
    items[index].unit_price = price;
    items[index].subtotal = price * items[index].quantity;
    setOrderItems(items);
  };

  const handleQuantityChange = (index, qty) => {
    const q = Math.max(parseInt(qty) || 1, 1);
    const items = [...orderItems];
    items[index].quantity = q;
    items[index].subtotal = items[index].unit_price * q;
    setOrderItems(items);
  };

  const handleAddLineItem = () => {
    const prod = products[0];
    setOrderItems([
      ...orderItems,
      {
        product: prod?.id || '',
        quantity: 1,
        unit_price: prod ? parseFloat(prod.unit_price) : 0,
        subtotal: prod ? parseFloat(prod.unit_price) : 0
      }
    ]);
  };

  const handleRemoveLineItem = (index) => {
    if (orderItems.length <= 1) return;
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const calculateGrandTotal = () => {
    return orderItems.reduce((acc, item) => acc + (item.subtotal || 0), 0);
  };

  const handleSaveOrder = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);

    if (!orderCustomer) {
      setFormError('Please select a customer.');
      setSaving(false);
      return;
    }

    try {
      const payload = {
        customer: orderCustomer,
        order_number: `ORD-MANUAL-${Date.now().toString().slice(-6)}`,
        order_date: new Date(orderDate).toISOString(),
        status: 'COMPLETED',
        notes: orderNotes,
        items: orderItems.map(item => ({
          product: item.product,
          quantity: item.quantity,
          unit_price: item.unit_price
        }))
      };

      await axiosClient.post('/business/orders/', payload);
      setIsCreateOpen(false);
      fetchOrders();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.detail || 'Failed to create order.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="badge badge-emerald"><CheckCircle2 size={12} /> Completed</span>;
      case 'PROCESSING':
        return <span className="badge badge-cyan"><Clock size={12} /> Processing</span>;
      case 'PENDING':
        return <span className="badge badge-amber"><Clock size={12} /> Pending</span>;
      default:
        return <span className="badge badge-rose"><XCircle size={12} /> {status}</span>;
    }
  };

  return (
    <div>
      <Navbar
        title="Orders & Sales Fulfillment"
        subtitle="Track multi-item purchases, line item breakdowns, and revenue allocations"
        actions={
          <button onClick={handleOpenCreate} className="btn-primary">
            <Plus size={16} /> Create Order
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
              placeholder="Search by order # or customer..."
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
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="input-field"
            style={{ width: 'auto' }}
          >
            <option value="">All Order Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="PROCESSING">Processing</option>
            <option value="PENDING">Pending</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
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
                    <th>Order #</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Line Items</th>
                    <th>Total Amount</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: '#0f172a', fontSize: '0.8rem' }}>
                        #{o.order_number}
                      </td>
                      <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {new Date(o.order_date).toLocaleDateString()} {new Date(o.order_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td>
                        <div style={{ fontWeight: 500, color: '#0f172a', fontSize: '0.84rem' }}>{o.customer_name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{o.customer_email}</div>
                      </td>
                      <td>{getStatusBadge(o.status)}</td>
                      <td>
                        <span className="badge badge-indigo">
                          {o.items?.length || 1} item(s)
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: '#059669', fontSize: '0.85rem' }}>
                        PKR {Number(o.total_amount).toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            setSelectedOrder(o);
                            setIsDetailOpen(true);
                          }}
                          className="btn-secondary"
                          style={{ padding: '0.35rem 0.65rem' }}
                        >
                          <Eye size={14} /> View Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                        No orders found.
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
              <div>Showing {orders.length} of {totalCount} orders</div>
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
                  disabled={orders.length < 15}
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

      {/* Create Order Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Customer Order"
        maxWidth="680px"
      >
        {formError && (
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.65rem', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '1rem' }}>
            {formError}
          </div>
        )}

        <form onSubmit={handleSaveOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.3rem' }}>
                Customer Account *
              </label>
              <select
                value={orderCustomer}
                onChange={(e) => setOrderCustomer(e.target.value)}
                required
                className="input-field"
              >
                <option value="">Select Customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.region})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.3rem' }}>
                Order Timestamp *
              </label>
              <input
                type="datetime-local"
                required
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Line items section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>
                Order Line Items
              </span>
              <button
                type="button"
                onClick={handleAddLineItem}
                className="btn-secondary"
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
              >
                + Add Product
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '220px', overflowY: 'auto', paddingRight: '0.25rem' }}>
              {orderItems.map((item, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr 1.2fr auto', gap: '0.5rem', alignItems: 'center', background: '#090d16', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <select
                      value={item.product}
                      onChange={(e) => handleProductChange(idx, e.target.value)}
                      required
                      className="input-field"
                      style={{ fontSize: '0.78rem', padding: '0.4rem 0.5rem' }}
                    >
                      <option value="">Choose item</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (${p.unit_price})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(idx, e.target.value)}
                      className="input-field"
                      style={{ fontSize: '0.78rem', padding: '0.4rem 0.5rem' }}
                    />
                  </div>
                  <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: '#94a3b8', textAlign: 'right' }}>
                    ${Number(item.unit_price).toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#34d399', textAlign: 'right' }}>
                    ${Number(item.subtotal).toFixed(2)}
                  </div>
                  <div>
                    <button
                      type="button"
                      disabled={orderItems.length <= 1}
                      onClick={() => handleRemoveLineItem(idx)}
                      style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total summary */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>Total Order Value:</span>
              <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#34d399' }}>
                ${calculateGrandTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.3rem' }}>
              Order Notes / Reference
            </label>
            <input
              type="text"
              value={orderNotes}
              onChange={(e) => setOrderNotes(e.target.value)}
              placeholder="e.g. Annual renewal terms signed"
              className="input-field"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.75rem' }}>
            <button type="button" onClick={() => setIsCreateOpen(false)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Creating Order...' : 'Confirm & Place Order'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Order Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={`Order Details - #${selectedOrder?.order_number}`}
        maxWidth="600px"
      >
        {selectedOrder && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>#{selectedOrder.order_number}</h4>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  {new Date(selectedOrder.order_date).toLocaleString()}
                </div>
              </div>
              <div>{getStatusBadge(selectedOrder.status)}</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '12px', marginBottom: '1.25rem', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Customer Details</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>{selectedOrder.customer_name}</div>
              <div style={{ fontSize: '0.78rem', color: '#4338ca', fontWeight: 500 }}>{selectedOrder.customer_email}</div>
            </div>

            <h5 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.6rem' }}>
              Order Line Items
            </h5>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <table className="saas-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th style={{ textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedOrder.items || []).map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.product_name || `Product #${item.product}`}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{item.product_sku}</div>
                      </td>
                      <td style={{ color: '#0f172a', fontWeight: 600 }}>{item.quantity}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: '#334155' }}>PKR {Number(item.unit_price).toLocaleString()}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#059669', textAlign: 'right' }}>
                        PKR {Number(item.subtotal).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.15rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontWeight: 700, color: '#334155' }}>Total Billed:</span>
              <span style={{ fontSize: '1.35rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#059669' }}>
                PKR {Number(selectedOrder.total_amount).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
