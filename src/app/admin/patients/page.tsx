'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import { getPatients, createPatient, updatePatient, getBookings, getReports, getPayments } from '@/lib/services/admin-db';
import { generateId } from '@/lib/id-generator';
import { logAudit } from '@/lib/services/audit-service';
import { Patient, Booking, Report, Payment } from '@/lib/types';
import {
  Search, Plus, X, Users, Phone, Mail, Calendar, Edit2,
  ChevronRight, Eye, UserPlus, Check, Loader2
} from 'lucide-react';

export default function PatientsPage() {
  const { tenantId, staffUser } = useAdmin();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientBookings, setPatientBookings] = useState<Booking[]>([]);
  const [patientReports, setPatientReports] = useState<Report[]>([]);
  const [patientPayments, setPatientPayments] = useState<Payment[]>([]);
  const [activeTab, setActiveTab] = useState('info');
  const [saving, setSaving] = useState(false);

  // New patient form
  const [form, setForm] = useState({
    name: '', mobile: '', email: '', age: '', gender: 'male' as const,
    address: '', city: '', notes: '',
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getPatients(tenantId);
        setPatients(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [tenantId]);

  // Load patient details
  const viewPatient = async (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveTab('info');
    try {
      const [b, r, p] = await Promise.all([
        getBookings(tenantId), getReports(tenantId), getPayments(tenantId),
      ]);
      setPatientBookings(b.filter(bk => bk.patientId === patient.id));
      setPatientReports(r.filter(rp => rp.patientId === patient.id));
      setPatientPayments(p.filter(py => py.patientId === patient.id));
    } catch {}
  };

  const handleAddPatient = async () => {
    if (!form.name || !form.mobile) return;
    setSaving(true);
    try {
      const patientId = await generateId(tenantId, 'PAT');
      const id = await createPatient({
        tenantId, patientId,
        name: form.name, mobile: form.mobile,
        email: form.email || undefined,
        age: parseInt(form.age) || undefined,
        gender: form.gender,
        address: form.address || undefined,
        city: form.city || undefined,
        notes: form.notes || undefined,
        totalBookings: 0,
        createdAt: new Date(), updatedAt: new Date(),
      });
      await logAudit(tenantId, staffUser?.uid || '', staffUser?.name || '', staffUser?.role || 'super_admin',
        `Created patient ${patientId}`, 'patient', id);
      setPatients([{ id, tenantId, patientId, name: form.name, mobile: form.mobile, email: form.email || undefined, age: parseInt(form.age) || undefined, gender: form.gender, address: form.address || undefined, city: form.city || undefined, notes: form.notes || undefined, totalBookings: 0, createdAt: new Date() } as Patient, ...patients]);
      setShowAddModal(false);
      setForm({ name: '', mobile: '', email: '', age: '', gender: 'male', address: '', city: '', notes: '' });
    } catch (err) { alert('Failed to create patient'); }
    finally { setSaving(false); }
  };

  const filtered = patients.filter(p => {
    const term = search.toLowerCase();
    return !search || p.name.toLowerCase().includes(term) ||
      p.mobile?.includes(term) || p.patientId?.toLowerCase().includes(term);
  });

  if (loading) {
    return <div className="admin-loading"><div className="admin-spinner" /><p className="admin-loading-text">Loading patients...</p></div>;
  }

  // Patient Detail View
  if (selectedPatient) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSelectedPatient(null)} className="admin-btn admin-btn-ghost" style={{ padding: 8 }}>
            <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {selectedPatient.name}
            </h1>
            <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 2 }}>{selectedPatient.patientId}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {['info', 'bookings', 'reports', 'payments'].map(tab => (
            <button key={tab} className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}>
              {tab === 'info' ? 'Personal Info' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'info' && (
          <div className="admin-card">
            <div className="admin-card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <InfoField label="Full Name" value={selectedPatient.name} />
                <InfoField label="Patient ID" value={selectedPatient.patientId} />
                <InfoField label="Mobile" value={selectedPatient.mobile} />
                <InfoField label="Email" value={selectedPatient.email || '—'} />
                <InfoField label="Age" value={selectedPatient.age?.toString() || '—'} />
                <InfoField label="Gender" value={selectedPatient.gender} />
                <InfoField label="Address" value={selectedPatient.address || '—'} />
                <InfoField label="City" value={selectedPatient.city || '—'} />
                <InfoField label="Total Bookings" value={selectedPatient.totalBookings?.toString() || '0'} />
                <InfoField label="Last Visit" value={selectedPatient.lastVisit ? new Date(selectedPatient.lastVisit).toLocaleDateString() : '—'} />
              </div>
              {selectedPatient.notes && (
                <div style={{ marginTop: 16, padding: 14, background: '#F8FAFC', borderRadius: 10 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94A3B8', marginBottom: 4 }}>Notes</div>
                  <div style={{ fontSize: '0.82rem', color: '#0F172A' }}>{selectedPatient.notes}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="admin-card" style={{ overflow: 'hidden' }}>
            <div className="admin-card-header">
              <div className="admin-card-title">Booking History ({patientBookings.length})</div>
            </div>
            <table className="admin-table">
              <thead><tr><th>Booking ID</th><th>Date</th><th>Tests</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {patientBookings.map(b => (
                  <tr key={b.id}>
                    <td style={{ fontFamily: 'monospace', color: '#0D9488', fontWeight: 600, fontSize: '0.78rem' }}>{b.bookingId}</td>
                    <td>{b.date}</td>
                    <td>{b.items?.map(i => i.testName).join(', ')}</td>
                    <td style={{ fontWeight: 700, color: '#059669' }}>₹{b.totalAmount}</td>
                    <td><span className={`admin-badge admin-badge-${b.status}`}>{b.status}</span></td>
                  </tr>
                ))}
                {patientBookings.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#94A3B8' }}>No bookings</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="admin-card" style={{ overflow: 'hidden' }}>
            <div className="admin-card-header"><div className="admin-card-title">Report History ({patientReports.length})</div></div>
            <table className="admin-table">
              <thead><tr><th>Report ID</th><th>Test</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {patientReports.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontFamily: 'monospace', color: '#0D9488', fontWeight: 600, fontSize: '0.78rem' }}>{r.reportId}</td>
                    <td>{r.testName}</td>
                    <td><span className={`admin-badge admin-badge-${r.status}`}>{r.status}</span></td>
                    <td>{r.createdAt instanceof Date ? r.createdAt.toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
                {patientReports.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: 32, color: '#94A3B8' }}>No reports</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="admin-card" style={{ overflow: 'hidden' }}>
            <div className="admin-card-header"><div className="admin-card-title">Payment History ({patientPayments.length})</div></div>
            <table className="admin-table">
              <thead><tr><th>Payment ID</th><th>Booking</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {patientPayments.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'monospace', color: '#0D9488', fontWeight: 600, fontSize: '0.78rem' }}>{p.paymentId}</td>
                    <td style={{ fontSize: '0.78rem' }}>{p.bookingDisplayId}</td>
                    <td style={{ fontWeight: 700, color: '#059669' }}>₹{p.amount}</td>
                    <td style={{ textTransform: 'uppercase', fontSize: '0.72rem' }}>{p.method}</td>
                    <td><span className={`admin-badge admin-badge-${p.status}`}>{p.status}</span></td>
                    <td>{p.date}</td>
                  </tr>
                ))}
                {patientPayments.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: '#94A3B8' }}>No payments</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // Patient List View
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Patients</h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: 2 }}>Manage patient database</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="admin-btn admin-btn-primary">
          <UserPlus size={15} /> Add Patient
        </button>
      </div>

      <div className="admin-header-search" style={{ maxWidth: 480 }}>
        <Search size={16} style={{ color: '#94A3B8' }} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, mobile, or patient ID..." />
        {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={14} style={{ color: '#94A3B8' }} /></button>}
      </div>

      <div className="admin-card" style={{ overflow: 'hidden' }}>
        <div className="admin-card-header">
          <div className="admin-card-title">All Patients</div>
          <span style={{ fontSize: '0.72rem', color: '#64748B', background: '#F1F5F9', padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>
            {filtered.length} records
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr><th>Patient ID</th><th>Name</th><th>Mobile</th><th>Age</th><th>Gender</th><th>Total Bookings</th><th>Last Visit</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => viewPatient(p)}>
                  <td style={{ fontFamily: 'monospace', color: '#0D9488', fontWeight: 600, fontSize: '0.78rem' }}>{p.patientId}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%', background: '#CCFBF1',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#0D9488', fontWeight: 700, fontSize: '0.78rem',
                      }}>{p.name?.charAt(0)}</div>
                      <span style={{ fontWeight: 600, color: '#0F172A' }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#64748B' }}>{p.mobile}</td>
                  <td>{p.age || '—'}</td>
                  <td style={{ textTransform: 'capitalize' }}>{p.gender}</td>
                  <td style={{ fontWeight: 600 }}>{p.totalBookings || 0}</td>
                  <td style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                    {p.lastVisit ? new Date(p.lastVisit).toLocaleDateString() : '—'}
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <button onClick={() => viewPatient(p)} className="admin-btn admin-btn-ghost" style={{ padding: 6 }}>
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8}>
                  <div className="admin-empty">
                    <Users size={36} style={{ color: '#CBD5E1', marginBottom: 8 }} />
                    <div className="admin-empty-title">No patients found</div>
                    <div className="admin-empty-desc">{search ? 'Try a different search' : 'Add your first patient'}</div>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="admin-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ fontWeight: 700, color: '#0F172A' }}>Add New Patient</div>
              <button onClick={() => setShowAddModal(false)} className="admin-btn admin-btn-ghost" style={{ padding: 4 }}>
                <X size={18} />
              </button>
            </div>
            <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label className="admin-label">Full Name *</label>
                  <input className="admin-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Patient name" /></div>
                <div><label className="admin-label">Mobile *</label>
                  <input className="admin-input" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} placeholder="10-digit mobile" /></div>
                <div><label className="admin-label">Email</label>
                  <input className="admin-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" /></div>
                <div><label className="admin-label">Age</label>
                  <input className="admin-input" type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} placeholder="Age" /></div>
                <div><label className="admin-label">Gender</label>
                  <select className="admin-select" value={form.gender} onChange={e => setForm({...form, gender: e.target.value as any})}>
                    <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                  </select></div>
                <div><label className="admin-label">City</label>
                  <input className="admin-input" value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="City" /></div>
              </div>
              <div><label className="admin-label">Address</label>
                <input className="admin-input" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Full address" /></div>
              <div><label className="admin-label">Notes</label>
                <input className="admin-input" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Any notes..." /></div>
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => setShowAddModal(false)} className="admin-btn admin-btn-secondary">Cancel</button>
              <button onClick={handleAddPatient} disabled={!form.name || !form.mobile || saving} className="admin-btn admin-btn-primary">
                {saving ? <><Loader2 size={15} style={{ animation: 'admin-spin 0.7s linear infinite' }} /> Saving...</> : <><Check size={15} /> Add Patient</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: 12, background: '#F8FAFC', borderRadius: 10 }}>
      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A', textTransform: label === 'Gender' ? 'capitalize' : undefined }}>{value}</div>
    </div>
  );
}
