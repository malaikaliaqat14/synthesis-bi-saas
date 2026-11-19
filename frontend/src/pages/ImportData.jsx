import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axiosClient from '../api/axiosClient';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Database,
  Loader2,
  Sparkles,
  Trash2
} from 'lucide-react';

const ImportData = () => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [validating, setValidating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [error, setError] = useState('');
  const [datasets, setDatasets] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await axiosClient.get('/business/datasets/');
      setDatasets(res.data.results || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleDeleteDataset = async (datasetId, filename) => {
    if (!window.confirm(`Are you sure you want to delete "${filename}"?\n\nDeleting this ingestion log will also clear all imported orders, sales, and customer data associated with it.`)) {
      return;
    }

    try {
      setDeletingId(datasetId);
      await axiosClient.delete(`/business/datasets/${datasetId}/`);
      fetchHistory();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete dataset.');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.name.endsWith('.csv')) {
      setError('Please select a valid CSV file.');
      return;
    }

    setFile(selected);
    setError('');
    setImportResult(null);
    setPreviewData(null);
    setValidating(true);

    // Call preview API
    const formData = new FormData();
    formData.append('file', selected);

    try {
      const res = await axiosClient.post('/business/import/preview/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPreviewData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to preview CSV.');
    } finally {
      setValidating(false);
    }
  };

  const handleProcessImport = async () => {
    if (!file) return;

    setImporting(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axiosClient.post('/business/import/process/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImportResult(res.data);
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.error || 'Import failed.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <Navbar
        title="Upload File"
        subtitle="Upload and manage business datasets"
      />

      <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(320px, 1.2fr)', gap: '1.5rem' }}>
        {/* Left Column: Upload & Config */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-panel" style={{ padding: '1.75rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UploadCloud size={22} color="#6366f1" /> Upload File
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Upload your orders CSV file to sync your sales and customers into the platform.
            </p>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecdd3', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {/* Dropzone matching clean reference UI */}
            <div style={{
              border: '2px dashed #cbd5e1',
              borderRadius: '16px',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              backgroundColor: '#f8fafc',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s ease'
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.backgroundColor = '#f5f7ff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#f8fafc'; }}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
              <FileSpreadsheet size={44} color="#6366f1" style={{ margin: '0 auto 0.75rem auto' }} />
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', fontFamily: 'serif' }}>
                {file ? file.name : 'Drag & drop your file here'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.35rem' }}>
                {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Or click to browse spreadsheet file (.csv)'}
              </div>
            </div>

            {validating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1rem', color: '#4338ca', fontSize: '0.82rem', fontWeight: 600 }}>
                <Loader2 size={16} className="animate-spin" /> Validating CSV schema and columns with Pandas...
              </div>
            )}

            {previewData && (
              <div style={{ marginTop: '1.25rem', padding: '1rem', background: previewData.is_valid ? '#f0fdf4' : '#fffbeb', borderRadius: '12px', border: `1px solid ${previewData.is_valid ? '#bbf7d0' : '#fde68a'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem', color: previewData.is_valid ? '#16a34a' : '#d97706' }}>
                    {previewData.is_valid ? '✓ Ready to Ingest' : '⚠ Missing Required Columns'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{previewData.filename}</span>
                </div>

                {previewData.missing_required_columns.length > 0 && (
                  <div style={{ fontSize: '0.78rem', color: '#dc2626', marginTop: '0.5rem' }}>
                    Missing required columns: {previewData.missing_required_columns.join(', ')}
                  </div>
                )}

                {previewData.is_valid && (
                  <button
                    onClick={handleProcessImport}
                    disabled={importing}
                    className="btn-primary"
                    style={{ width: '100%', marginTop: '1rem', justifyContent: 'center', padding: '0.65rem' }}
                  >
                    {importing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Ingesting Data...
                      </>
                    ) : (
                      <>
                        <Database size={16} /> Confirm & Ingest File
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Success summary badge */}
            {importResult && (
              <div style={{ marginTop: '1.25rem', padding: '1.1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <CheckCircle2 size={18} /> Ingestion Successful!
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', color: '#166534' }}>
                  <div>Cleaned Rows: <strong>{importResult.summary?.imported_rows}</strong></div>
                  <div>New Customers: <strong>{importResult.summary?.created_customers}</strong></div>
                  <div>New Products: <strong>{importResult.summary?.created_products}</strong></div>
                  <div>Created Orders: <strong>{importResult.summary?.created_orders}</strong></div>
                  <div style={{ gridColumn: 'span 2', color: '#15803d', fontWeight: 600, marginTop: '0.25rem' }}>
                    Added Revenue: PKR {Number(importResult.summary?.total_revenue || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Preview Table & History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* File Row Preview */}
          {previewData && previewData.preview_rows && (
            <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.85rem' }}>
                First 5 Preview Rows
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="saas-table" style={{ fontSize: '0.78rem' }}>
                  <thead>
                    <tr>
                      {previewData.detected_columns.map((c, i) => (
                        <th key={i}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.preview_rows.map((row, idx) => (
                      <tr key={idx}>
                        {previewData.detected_columns.map((c, i) => (
                          <td key={i}>{String(row[c] || '')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Import History */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
              Dataset Ingestion History
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>
              Previous CSV processing logs for this tenant
            </p>

            {loadingHistory ? (
              <div style={{ display: 'flex', height: '120px', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                <Loader2 size={24} className="animate-spin" />
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="saas-table">
                  <thead>
                    <tr>
                      <th>Filename</th>
                      <th>Imported Rows</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datasets.map((d) => (
                      <tr key={d.id}>
                        <td style={{ fontWeight: 600, color: '#0f172a' }}>{d.name}</td>
                        <td>{d.row_count} rows</td>
                        <td>
                          <span className={`badge ${d.status === 'COMPLETED' ? 'badge-emerald' : (d.status === 'PROCESSING' ? 'badge-cyan' : 'badge-rose')}`}>
                            {d.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          {new Date(d.created_at).toLocaleDateString()}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteDataset(d.id, d.name)}
                            disabled={deletingId === d.id}
                            title="Delete dataset and clear all imported data"
                            className="btn-danger"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                          >
                            <Trash2 size={13} />
                            {deletingId === d.id ? 'Deleting...' : 'Delete & Clear'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {datasets.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', color: '#64748b', padding: '1.5rem' }}>
                          No historical dataset uploads found.
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
    </div>
  );
};

export default ImportData;
