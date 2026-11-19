import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axiosClient from '../api/axiosClient';
import {
  FileSpreadsheet,
  Download,
  Plus,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Sparkles
} from 'lucide-react';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generation form
  const [reportType, setReportType] = useState('CONSOLIDATED');
  const [fileFormat, setFileFormat] = useState('CSV');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/reports/');
      setReports(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setMessage('');

    try {
      const payload = {
        report_type: reportType,
        file_format: fileFormat,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      };

      const res = await axiosClient.post('/reports/', payload);
      setMessage(`Report "${res.data.title}" successfully generated in ${fileFormat}!`);
      fetchReports();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert("Report generation failed.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (reportId) => {
    const token = localStorage.getItem('access_token');
    const companyId = localStorage.getItem('active_company_id');
    window.open(`/api/reports/${reportId}/download/?token=${token}`, '_blank');
  };

  const reportTypes = [
    { value: 'CONSOLIDATED', label: 'All-in-One Consolidated Business Report (All Data)' },
    { value: 'SALES', label: 'Sales Performance Report' },
    { value: 'CUSTOMER', label: 'Customer Directory Report' },
    { value: 'PRODUCT', label: 'Product Inventory & Pricing Report' },
    { value: 'REVENUE', label: 'Revenue & Expense Cashflow Report' },
  ];

  return (
    <div>
      <Navbar
        title="Executive Reports & Export Engine"
        subtitle="Generate tenant-scoped analytics reports in CSV and styled PDF format"
      />

      <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(320px, 1.5fr)', gap: '1.5rem' }}>
        {/* Generate Report Form */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="#6366f1" /> Generate New Report
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
            Compiles live transactional, product, customer, and ML prediction data
          </p>

          {message && (
            <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} /> {message}
            </div>
          )}

          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.35rem' }}>
                Report Domain *
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="input-field"
              >
                {reportTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.35rem' }}>
                Export Format *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setFileFormat('PDF')}
                  style={{
                    padding: '0.6rem',
                    borderRadius: '8px',
                    border: fileFormat === 'PDF' ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
                    background: fileFormat === 'PDF' ? 'rgba(99, 102, 241, 0.2)' : '#0c1222',
                    color: fileFormat === 'PDF' ? '#ffffff' : '#94a3b8',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Styled PDF Document
                </button>
                <button
                  type="button"
                  onClick={() => setFileFormat('CSV')}
                  style={{
                    padding: '0.6rem',
                    borderRadius: '8px',
                    border: fileFormat === 'CSV' ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
                    background: fileFormat === 'CSV' ? 'rgba(99, 102, 241, 0.2)' : '#0c1222',
                    color: fileFormat === 'CSV' ? '#ffffff' : '#94a3b8',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Raw CSV Spreadsheet
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.3rem' }}>
                  From Date (Optional)
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.3rem' }}>
                  To Date (Optional)
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={generating}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.7rem' }}
            >
              {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {generating ? 'Generating Document...' : `Generate ${fileFormat} Report`}
            </button>
          </form>
        </div>

        {/* Generated Reports History */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
            Generated Reports Repository
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
            Previous export runs available for download
          </p>

          {loading ? (
            <div style={{ display: 'flex', height: '200px', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
              <Loader2 size={32} className="animate-spin" />
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="saas-table">
                <thead>
                  <tr>
                    <th>Report Title</th>
                    <th>Format</th>
                    <th>Generated Date</th>
                    <th style={{ textAlign: 'right' }}>Download</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#f8fafc' }}>{r.title}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Type: {r.report_type}</div>
                      </td>
                      <td>
                        <span className={`badge ${r.file_format === 'PDF' ? 'badge-rose' : 'badge-emerald'}`}>
                          {r.file_format}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {new Date(r.created_at).toLocaleDateString()} {new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleDownload(r.id)}
                          className="btn-secondary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                        >
                          <Download size={13} /> Download
                        </button>
                      </td>
                    </tr>
                  ))}
                  {reports.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                        No reports generated yet. Select a domain on the left to export.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
