import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import axiosClient from '../api/axiosClient';
import {
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Sparkles,
  Loader2,
  RefreshCw,
  Database
} from 'lucide-react';
import {
  LineChart, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const MLForecast = () => {
  // Model 1: Forecast State
  const [forecastData, setForecastData] = useState(null);
  const [forecastDays, setForecastDays] = useState(14);
  const [forecastLoading, setForecastLoading] = useState(true);

  // Re-train state
  const [training, setTraining] = useState(false);
  const [trainStatus, setTrainStatus] = useState('');

  const fetchForecast = async () => {
    try {
      setForecastLoading(true);
      const res = await axiosClient.get(`/ml/sales-forecast/?days=${forecastDays}`);
      setForecastData(res.data);
    } catch (e) {
      console.error("Forecast error:", e);
    } finally {
      setForecastLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, [forecastDays]);

  const handleRetrain = async () => {
    if (!window.confirm("Trigger re-training for the Scikit-learn sales forecasting model? This will recompute parameters based on your uploaded order data.")) return;
    setTraining(true);
    setTrainStatus('Training Ridge regression sales forecasting model on your transactions...');
    try {
      await axiosClient.post('/ml/train/');
      setTrainStatus('✓ Sales prediction model successfully re-trained!');
      fetchForecast();
      setTimeout(() => setTrainStatus(''), 4000);
    } catch (e) {
      setTrainStatus('Training failed. Ensure order data exists.');
      setTimeout(() => setTrainStatus(''), 4000);
    } finally {
      setTraining(false);
    }
  };

  const hasData = Boolean(
    forecastData?.has_data !== false &&
    forecastData?.forecast &&
    forecastData.forecast.length > 0
  );

  // Combine historical tail and forecast for seamless visualization
  const combinedForecastChartData = [];
  if (hasData && forecastData) {
    (forecastData.historical_series || []).forEach(item => {
      combinedForecastChartData.push({
        date: item.date,
        historical: item.revenue,
        predicted: null
      });
    });
    // Stitch connection point
    if (forecastData.historical_series?.length > 0 && forecastData.forecast?.length > 0) {
      const lastHist = forecastData.historical_series[forecastData.historical_series.length - 1];
      combinedForecastChartData[combinedForecastChartData.length - 1].predicted = lastHist.revenue;
    }
    (forecastData.forecast || []).forEach(item => {
      combinedForecastChartData.push({
        date: item.date,
        historical: null,
        predicted: item.predicted_revenue
      });
    });
  }

  return (
    <div>
      <Navbar
        title="Future Price Prediction"
      />

      {trainStatus && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '8px',
          color: '#4f46e5',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Sparkles size={16} /> {trainStatus}
        </div>
      )}

      <div style={{ marginTop: '1.5rem' }}>
        {forecastLoading ? (
          <div style={{ display: 'flex', height: '40vh', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
            <Loader2 size={36} className="animate-spin" />
          </div>
        ) : !hasData ? (
          <div className="glass-panel" style={{
            padding: '3rem 2rem',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            textAlign: 'center',
            maxWidth: '680px',
            margin: '2rem auto'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              color: '#64748b'
            }}>
              <Database size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              No Sales Data Available
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Datasets were cleared or no transaction history is present in this workspace. Upload an orders CSV file in the <strong>Upload File</strong> tab to generate future sales predictions.
            </p>
            <a
              href="/import"
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
            >
              Go to Upload File
            </a>
          </div>
        ) : (
          <div>
            {/* Top Metrics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <StatCard
                title="Projected Future Revenue"
                value={`PKR ${(forecastData?.projected_revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                subtitle={`Forecast for next ${forecastDays} days`}
                icon={TrendingUp}
                color="#8b5cf6"
              />
              <StatCard
                title="Active Algorithm"
                value={forecastData?.model_name || 'Ridge Regression'}
                subtitle="Optimized Scikit-learn regressor"
                icon={BrainCircuit}
                color="#6366f1"
              />
            </div>

            {/* Chart Card */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                    Historical Sales vs ML Revenue Trajectory
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Historical daily revenue (solid blue) transitioning to forward predictions (dashed purple)
                  </p>
                </div>

                {/* Horizon selector */}
                <div style={{ display: 'flex', gap: '0.35rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '8px' }}>
                  {[7, 14, 30].map(d => (
                    <button
                      key={d}
                      onClick={() => setForecastDays(d)}
                      style={{
                        background: forecastDays === d ? '#6366f1' : 'transparent',
                        color: forecastDays === d ? '#fff' : '#64748b',
                        border: 'none',
                        padding: '0.35rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {d} Days
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={combinedForecastChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `PKR ${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '10px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                      formatter={(v) => [`PKR ${Number(v).toLocaleString()}`, '']}
                    />
                    <Legend wrapperStyle={{ fontSize: '0.8rem', color: '#64748b' }} />
                    <Line type="monotone" dataKey="historical" name="Historical Sales" stroke="#3b82f6" strokeWidth={2.5} dot={true} />
                    <Line type="monotone" dataKey="predicted" name="AI Projected Revenue" stroke="#a855f7" strokeWidth={2.5} strokeDasharray="5 5" dot={true} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MLForecast;
