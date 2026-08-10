'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { getReports, updateReportStatus, createReport, getBookings } from '@/lib/services/admin-db';
import { generateId } from '@/lib/id-generator';
import { logAudit } from '@/lib/services/audit-service';
import { triggerEventNotification } from '@/lib/services/notification-service';
import { Report, Booking, REPORT_STATUSES, ReportStatus } from '@/lib/types';
import {
  Search, X, FileText, Upload, Download, Eye, Check,
  CheckCircle, Shield, Loader2, Plus, Filter
} from 'lucide-react';

export default function ReportsPage() {
  const { tenantId, staffUser, can } = useAdmin();
  const [reports, setReports] = useState<Report[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({ bookingId: '', testName: '', patientId: '', patientName: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [r, b] = await Promise.all([getReports(tenantId), getBookings(tenantId)]);
        setReports(r);
        setBookings(b);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [tenantId]);

  const filtered = reports.filter(r => {
    const term = search.toLowerCase();
    const matchSearch = !search || r.patientName?.toLowerCase().includes(term) ||
      r.reportId?.toLowerCase().includes(term) || r.testName?.toLowerCase().includes(term);
    const matchStatus = !filterStatus || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = async (report: Report, newStatus: ReportStatus) => {
    try {
      const extraData: Partial<Report> = {};
      if (newStatus === 'verified') {
        extraData.verifiedBy = staffUser?.uid;
        extraData.verifiedByName = staffUser?.name;
      }
      await updateReportStatus(report.id, newStatus, extraData);
      setReports(cur => cur.map(r => r.id === report.id ? { ...r, status: newStatus, ...extraData } : r));

      await logAudit(tenantId, staffUser?.uid || '', staffUser?.name || '', staffUser?.role || 'super_admin',
        `Updated report ${report.reportId} to ${newStatus}`, 'report', report.id);

      // Trigger notification when report is marked ready
      if (newStatus === 'ready') {
        await triggerEventNotification(tenantId, report.patientId, report.patientName, 'report_ready', {
          testName: report.testName, reportLink: '#', labName: 'Lab',
        });
      }
    } catch { alert('Failed to update status'); }
  };

  const handleUpload = async () => {
    if (!uploadForm.bookingId || !uploadForm.testName) return;
    setSaving(true);
    try {
      const reportId = await generateId(tenantId, 'RPT');
      const booking = bookings.find(b => b.id === uploadForm.bookingId);
      const id = await createReport({
        tenantId, reportId,
        bookingId: uploadForm.bookingId,
        bookingDisplayId: booking?.bookingId || '',
        patientId: booking?.patientId || '',
        patientName: booking?.patientName || '',
        testName: uploadForm.testName,
        pdfUrl: '#uploaded-pdf', // In production: upload to Firebase Storage
        status: 'uploaded',
        uploadedBy: staffUser?.uid,
        uploadedByName: staffUser?.name,
        uploadedAt: new Date(),
        createdAt: new Date(), updatedAt: new Date(),
      });
      await logAudit(tenantId, staffUser?.uid || '', staffUser?.name || '', staffUser?.role || 'super_admin',
        `Uploaded report ${reportId}`, 'report', id);
      setReports([{
        id, tenantId, reportId, bookingId: uploadForm.bookingId,
        bookingDisplayId: booking?.bookingId || '', patientId: booking?.patientId || '',
        patientName: booking?.patientName || '', testName: uploadForm.testName,
        pdfUrl: '#', status: 'uploaded', uploadedBy: staffUser?.uid,
        uploadedByName: staffUser?.name, createdAt: new Date(), updatedAt: new Date(),
      } as Report, ...reports]);
      setShowUpload(false);
      setUploadForm({ bookingId: '', testName: '', patientId: '', patientName: '' });
    } catch { alert('Failed to upload report'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /><p className="admin-loading-text">Loading reports...</p></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Reports</h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: 2 }}>Upload, verify, and manage patient reports</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="admin-btn admin-btn-primary">
          <Upload size={15} /> Upload Report
        </button>
      </div>

      {/* Status Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
        {REPORT_STATUSES.map(s => (
          <button key={s.key} onClick={() => setFilterStatus(filterStatus === s.key ? '' : s.key)}
            className="admin-stat-card" style={{
              cursor: 'pointer', padding: 12, textAlign: 'left',
              border: filterStatus === s.key ? `2px solid ${s.color}` : undefined,
            }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>
              {reports.filter(r => r.status === s.key).length}
            </div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: s.color }}>{s.label}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="admin-header-search" style={{ maxWidth: 400 }}>
        <Search size={16} style={{ color: '#94A3B8' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reports..." />
      </div>

      {/* Report Workflow Info */}
      <div style={{
        background: '#F0FDFA', border: '1px solid #CCFBF1', borderRadius: 12, padding: '12px 16px',
        fontSize: '0.78rem', color: '#0D9488', display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Shield size={16} />
        <span><strong>Workflow:</strong> Upload → Verify → Mark Ready → Patient Notified. Reports are NOT sent until verified.</span>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ overflow: 'hidden' }}>
        <div className="admin-card-header">
          <div className="admin-card-title">All Reports</div>
          <span style={{ fontSize: '0.72rem', color: '#64748B', background: '#F1F5F9', padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>
            {filtered.length} records
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr><th>Report ID</th><th>Patient</th><th>Booking</th><th>Test</th><th>Status</th><th>Uploaded By</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td style={{ fontFamily: 'monospace', color: '#0D9488', fontWeight: 600, fontSize: '0.78rem' }}>{r.reportId}</td>
                  <td style={{ fontWeight: 600, color: '#0F172A' }}>{r.patientName}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#64748B' }}>{r.bookingDisplayId}</td>
                  <td>{r.testName}</td>
                  <td>
                    <select value={r.status}
                      onChange={e => handleStatusChange(r, e.target.value as ReportStatus)}
                      className={`admin-badge admin-badge-${r.status}`}
                      style={{ cursor: 'pointer', border: 'none', outline: 'none', padding: '4px 8px', fontSize: '0.72rem' }}>
                      {REPORT_STATUSES.map(s => (
                        <option key={s.key} value={s.key}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: '#64748B' }}>{r.uploadedByName || '—'}</td>
                  <td style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                    {r.createdAt instanceof Date ? r.createdAt.toLocaleDateString() : '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {r.status === 'uploaded' && can('reports.verify') && (
                        <button onClick={() => handleStatusChange(r, 'verified')} className="admin-btn admin-btn-ghost" style={{ padding: 6, color: '#0D9488' }} title="Verify">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {r.status === 'verified' && can('reports.mark_ready') && (
                        <button onClick={() => handleStatusChange(r, 'ready')} className="admin-btn admin-btn-ghost" style={{ padding: 6, color: '#059669' }} title="Mark Ready">
                          <Check size={16} />
                        </button>
                      )}
                      <button className="admin-btn admin-btn-ghost" style={{ padding: 6 }} title="Preview">
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8}>
                <div className="admin-empty">
                  <FileText size={36} style={{ color: '#CBD5E1', marginBottom: 8 }} />
                  <div className="admin-empty-title">No reports found</div>
                </div>
              </td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="admin-modal-overlay" onClick={() => setShowUpload(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ fontWeight: 700, color: '#0F172A' }}>Upload Report</div>
              <button onClick={() => setShowUpload(false)} className="admin-btn admin-btn-ghost" style={{ padding: 4 }}><X size={18} /></button>
            </div>
            <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="admin-label">Select Booking *</label>
                <select className="admin-select" value={uploadForm.bookingId}
                  onChange={e => {
                    const b = bookings.find(bk => bk.id === e.target.value);
                    setUploadForm({
                      bookingId: e.target.value,
                      testName: b?.items?.[0]?.testName || '',
                      patientId: b?.patientId || '',
                      patientName: b?.patientName || '',
                    });
                  }}>
                  <option value="">Choose booking...</option>
                  {bookings.filter(b => b.status !== 'cancelled').map(b => (
                    <option key={b.id} value={b.id}>{b.bookingId} — {b.patientName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="admin-label">Test Name *</label>
                <input className="admin-input" value={uploadForm.testName}
                  onChange={e => setUploadForm({...uploadForm, testName: e.target.value})} placeholder="Test name" />
              </div>
              <div>
                <label className="admin-label">Report PDF</label>
                <div style={{
                  border: '2px dashed #E2E8F0', borderRadius: 12, padding: 32, textAlign: 'center',
                  cursor: 'pointer', background: '#F8FAFC',
                }}>
                  <Upload size={24} style={{ color: '#94A3B8', marginBottom: 8 }} />
                  <p style={{ fontSize: '0.82rem', color: '#64748B' }}>Click to upload or drag & drop</p>
                  <p style={{ fontSize: '0.68rem', color: '#94A3B8' }}>PDF only, max 10MB</p>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => setShowUpload(false)} className="admin-btn admin-btn-secondary">Cancel</button>
              <button onClick={handleUpload} disabled={!uploadForm.bookingId || !uploadForm.testName || saving} className="admin-btn admin-btn-primary">
                {saving ? <><Loader2 size={15} style={{ animation: 'admin-spin 0.7s linear infinite' }} /> Uploading...</> : <><Upload size={15} /> Upload</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
