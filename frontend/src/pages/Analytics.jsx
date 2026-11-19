import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import axiosClient from '../api/axiosClient';
import {
  TrendingUp,
  Users,
  Repeat,
  DollarSign,
  Award,
  Loader2,
  Globe
} from 'lucide-react';
import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/analytics/customer-analytics/');
      setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div>
      <Navbar
        title="Customer Analytics & Cohorts"
        subtitle="Deep customer lifetime value, retention metrics, and purchase frequency curves"
      />

      {loading ? (
        <div style={{ display: 'flex', height: '50vh', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
          <Loader2 size={36} className="animate-spin" />
        </div>
      ) : (
        <div style={{ marginTop: '1.25rem' }}>
          {/* Top KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <StatCard
              title="Average Customer Lifetime Value"
              value={`PKR ${(data?.average_clv || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
              icon={TrendingUp}
              color="#10b981"
              subtitle="Mean lifetime revenue per account"
            />
            <StatCard
              title="Repeat Customer Rate"
              value={`${data?.repeat_customer_rate || 0}%`}
              icon={Repeat}
              color="#6366f1"
              subtitle="Accounts with >1 recorded order"
            />
            <StatCard
              title="Total Analyzed Accounts"
              value={(data?.total_customers || 0).toLocaleString()}
              icon={Users}
              color="#06b6d4"
              subtitle="Distinct tenant customers"
            />
          </div>

          {/* Frequency Distribution Chart */}
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>
              Purchase Frequency Cohort Distribution
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              Categorization of customer accounts by order volume clusters
            </p>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.purchase_frequency_distribution || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} formatter={(v) => [v, 'Customers']} />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top 10 High Value VIP Leaderboard */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Award size={20} color="#f59e0b" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                Top 10 High-Value VIP Customer Accounts
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
              Ranked by cumulative historical spending across all product lines
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table className="saas-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Customer Name</th>
                    <th>Email</th>
                    <th>Region</th>
                    <th>Orders</th>
                    <th>Total Spend</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.top_customers || []).map((c, idx) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 700, color: idx === 0 ? '#fbbf24' : (idx === 1 ? '#94a3b8' : (idx === 2 ? '#b45309' : '#64748b')) }}>
                        #{idx + 1}
                      </td>
                      <td style={{ fontWeight: 600, color: '#ffffff' }}>{c.name}</td>
                      <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.email}</td>
                      <td>
                        <span className="badge badge-indigo">
                          <Globe size={11} /> {c.region}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500, color: '#334155' }}>{c.orders} orders</td>
                      <td style={{ fontWeight: 600, color: '#059669', fontSize: '0.875rem' }}>
                        PKR {Number(c.total_spent).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {(!data?.top_customers || data.top_customers.length === 0) && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', color: '#64748b', padding: '1.5rem' }}>
                        No customer spending history available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
