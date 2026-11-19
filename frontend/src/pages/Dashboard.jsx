import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import axiosClient from '../api/axiosClient';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Receipt,
  TrendingUp,
  CreditCard,
  Calendar,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('year');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [insights, setInsights] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      let url = `/analytics/dashboard/?time_range=${timeRange}`;
      if (timeRange === 'custom' && customStart && customEnd) {
        url += `&start_date=${customStart}&end_date=${customEnd}`;
      }

      const [dashRes, insRes] = await Promise.all([
        axiosClient.get(url),
        axiosClient.get('/analytics/insights/'),
      ]);

      setData(dashRes.data);
      setInsights(insRes.data.insights || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const handleApplyCustom = () => {
    if (customStart && customEnd) {
      setTimeRange('custom');
      fetchDashboardData();
    }
  };

  const timeFilterOptions = [
    { label: 'Today', value: 'today' },
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 3 Months', value: '3m' },
    { label: 'Last 6 Months', value: '6m' },
    { label: 'This Year', value: 'year' },
  ];

  const kpis = data?.kpis || {};
  const charts = data?.charts || {};

  return (
    <div>
      <Navbar
        title="Analytics"
        actions={
          <button
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '0.45rem 0.8rem' }}
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        }
      />

      {/* Date Range Selector Toolbar */}
      <div style={{
        marginTop: '1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', background: '#f1f5f9', padding: '0.3rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          {timeFilterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setShowCustom(false);
                setTimeRange(opt.value);
              }}
              style={{
                background: timeRange === opt.value && !showCustom ? '#ffffff' : 'transparent',
                color: timeRange === opt.value && !showCustom ? '#4338ca' : '#64748b',
                boxShadow: timeRange === opt.value && !showCustom ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                border: 'none',
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
            >
              {opt.label}
            </button>
          ))}
          <button
            onClick={() => setShowCustom(!showCustom)}
            style={{
              background: showCustom ? '#ffffff' : 'transparent',
              color: showCustom ? '#4338ca' : '#64748b',
              boxShadow: showCustom ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              border: 'none',
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Calendar size={14} /> Custom
          </button>
        </div>

        {showCustom && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ffffff', padding: '0.4rem 0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="input-field"
              style={{ width: 'auto', padding: '0.35rem 0.6rem', fontSize: '0.8rem', border: '1px solid #cbd5e1' }}
            />
            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>to</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="input-field"
              style={{ width: 'auto', padding: '0.35rem 0.6rem', fontSize: '0.8rem', border: '1px solid #cbd5e1' }}
            />
            <button onClick={handleApplyCustom} className="btn-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}>
              Apply
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', height: '50vh', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
          <Loader2 size={36} className="animate-spin" />
        </div>
      ) : (
        <>
          {/* Professional 6 KPI Cards Grid (Expenses Removed) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.15rem',
            marginBottom: '1.75rem',
            marginTop: '0.5rem'
          }}>
            <StatCard
              title="Total Revenue"
              value={`PKR ${(kpis.total_revenue || 0).toLocaleString()}`}
              icon={TrendingUp}
              color="#4f46e5"
              subtitle="Gross transaction sales"
            />
            <StatCard
              title="Total Orders"
              value={(kpis.total_orders || 0).toLocaleString()}
              icon={ShoppingCart}
              color="#0284c7"
              subtitle="Fulfilled customer orders"
            />
            <StatCard
              title="Total Customers"
              value={(kpis.total_customers || 0).toLocaleString()}
              icon={Users}
              color="#059669"
              subtitle="Registered client profiles"
            />
            <StatCard
              title="Active Catalog SKUs"
              value={(kpis.total_products || 0).toLocaleString()}
              icon={Package}
              color="#7c3aed"
              subtitle="Ready-to-sell dress designs"
            />
            <StatCard
              title="Estimated Gross Profit"
              value={`PKR ${(kpis.net_profit || 0).toLocaleString()}`}
              icon={TrendingUp}
              color="#059669"
              subtitle={`${kpis.profit_margin || 0}% gross margin`}
            />
            <StatCard
              title="Average Order Value"
              value={`PKR ${(kpis.aov || 0).toLocaleString()}`}
              icon={CreditCard}
              color="#d97706"
              subtitle="Average basket volume"
            />
          </div>

          {/* Charts Row 1: Revenue Over Time & Daily Orders */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {/* Revenue Area Chart */}
            <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                    Revenue Over Time (PKR)
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Daily sales aggregation powered by Pandas
                  </p>
                </div>
                <span className="badge badge-indigo">Daily Inflow</span>
              </div>
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts.revenue_over_time || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `PKR ${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '10px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      formatter={(v) => [`PKR ${Number(v).toLocaleString()}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Orders Bar Chart */}
            <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                    Order Frequency Over Time
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Daily volume of fulfilled customer orders
                  </p>
                </div>
                <span className="badge badge-cyan">Volume</span>
              </div>
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.orders_over_time || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '10px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      formatter={(v) => [v, 'Orders']}
                    />
                    <Bar dataKey="orders" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Charts Row 2: Sales by Category, Region & Profit Trend */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {/* Sales by Category */}
            <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                Sales by Category
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>
                Revenue contribution by product domain
              </p>
              <div style={{ width: '100%', height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.sales_by_category || []} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `PKR ${(v/1000).toFixed(0)}k`} />
                    <YAxis type="category" dataKey="category" stroke="#64748b" fontSize={10} width={90} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '10px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} formatter={(v) => [`PKR ${Number(v).toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sales by Region (Donut Chart) */}
            <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                Sales by Province / Region
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>
                Geographical revenue distribution across Pakistan
              </p>
              <div style={{ width: '100%', height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.sales_by_region || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="revenue"
                      nameKey="region"
                    >
                      {(charts.sales_by_region || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '10px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} formatter={(v) => [`PKR ${Number(v).toLocaleString()}`, 'Revenue']} />
                    <Legend wrapperStyle={{ fontSize: '0.75rem', color: '#64748b' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Profit Trend (Gross Margin) */}
            <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                Gross Profit Trend
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>
                Revenue minus Cost of Goods Sold
              </p>
              <div style={{ width: '100%', height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts.profit_trend || []} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `PKR ${(v/1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '10px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} formatter={(v) => [`PKR ${Number(v).toLocaleString()}`, 'Gross Profit']} />
                    <Line type="monotone" dataKey="gross_profit" stroke="#10b981" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Products Leaderboard Table */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
              Top Performing Products
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>
              Highest grossing catalog items during selected time window
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table className="saas-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Units Sold</th>
                    <th>Total Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {(charts.top_products || []).map((p, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 500, color: '#0f172a' }}>{p.product}</td>
                      <td style={{ color: '#475569' }}>{p.units_sold} units</td>
                      <td style={{ fontWeight: 600, color: '#4338ca' }}>
                        PKR {Number(p.revenue).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {(!charts.top_products || charts.top_products.length === 0) && (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', color: '#64748b', padding: '1.5rem' }}>
                        No product sales recorded for this date range.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
