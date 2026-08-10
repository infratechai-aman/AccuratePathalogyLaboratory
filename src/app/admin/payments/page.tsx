'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { getPayments, createPayment, getBookings } from '@/lib/services/admin-db';
import { generateId } from '@/lib/id-generator';
import { logAudit } from '@/lib/services/audit-service';
import { Payment, Booking, PAYMENT_STATUSES, PaymentStatus, PaymentMethod } from '@/lib/types';
import { Search, X, IndianRupee, Plus, Check, Loader2, Download } from 'lucide-react';

export default function PaymentsPage() {
  const { tenantId, staffUser } = useAdmin();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ bookingId: '', amount: '', method: 'cash' as PaymentMethod, status: 'paid' as PaymentStatus, notes: '' });

  useEffect(() => {
    async function load() {
      try {
        const [p, b] = await Promise.all([getPayments(tenantId), getBookings(tenantId)]);
        setPayments(p); setBookings(b);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [tenantId]);

  const filtered = payments.filter(p => {
    const term = search.toLowerCase();
    return (!search || p.patientName?.toLowerCase().includes(term) || p.paymentId?.toLowerCase().includes(term)) &&
      (!filterStatus || p.status === filterStatus) && (!filterMethod || p.method === filterMethod);
  });

  const totalRevenue = payments.filter(p => p.status === 'paid' || p.status === 'partial').reduce((s, p) => s + p.amount, 0);
  const today = new Date().toISOString().split('T')[0];
  const todayRevenue = payments.filter(p => p.date === today && (p.status === 'paid' || p.status === 'partial')).reduce((s, p) => s + p.amount, 0);

  const handleAdd = async () => {
    if (!form.bookingId || !form.amount) return;
    setSaving(true);
    try {
      const booking = bookings.find(b => b.id === form.bookingId);
      const paymentId = await generateId(tenantId, 'PAY');
      const id = await createPayment({
        tenantId, paymentId, bookingId: form.bookingId,
        bookingDisplayId: booking?.bookingId || '',
        patientId: booking?.patientId || '', patientName: booking?.patientName || '',
        amount: parseFloat(form.amount), method: form.method, status: form.status,
        notes: form.notes || undefined, date: today,
        recordedBy: staffUser?.uid || '', recordedByName: staffUser?.name || '',
        createdAt: new Date(),
      });
      await logAudit(tenantId, staffUser?.uid || '', staffUser?.name || '', staffUser?.role || 'super_admin',
        `Recorded payment ${paymentId}`, 'payment', id);
      setPayments([{ id, tenantId, paymentId, bookingId: form.bookingId, bookingDisplayId: booking?.bookingId || '',
        patientId: booking?.patientId || '', patientName: booking?.patientName || '',
        amount: parseFloat(form.amount), method: form.method, status: form.status, date: today,
        recordedBy: staffUser?.uid || '', recordedByName: staffUser?.name || '', createdAt: new Date(),
      }, ...payments]);
      setShowAdd(false); setForm({ bookingId: '', amount: '', method: 'cash', status: 'paid', notes: '' });
    } catch { alert('Failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /><p className="admin-loading-text">Loading payments...</p></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Payments</h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: 2 }}>Track and record payments</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="admin-btn admin-btn-primary"><Plus size={15} /> Record Payment</button>
      </div>

      {/* Revenue Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Today&apos;s Revenue</div>
          <div className="admin-stat-value" style={{ color: '#059669' }}>₹{todayRevenue.toLocaleString('en-IN')}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Revenue</div>
          <div className="admin-stat-value">₹{totalRevenue.toLocaleString('en-IN')}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Pending Payments</div>
          <div className="admin-stat-value" style={{ color: '#D97706' }}>{payments.filter(p => p.status === 'pending').length}</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <div className="admin-header-search" style={{ flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ color: '#94A3B8' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search payments..." />
        </div>
        <select className="admin-select" style={{ width: 'auto' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          {PAYMENT_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
        <select className="admin-select" style={{ width: 'auto' }} value={filterMethod} onChange={e => setFilterMethod(e.target.value)}>
          <option value="">All Methods</option>
          <option value="cash">Cash</option><option value="upi">UPI</option><option value="card">Card</option><option value="online">Online</option>
        </select>
      </div>

      {/* Table */}
      <div className="admin-card" style={{ overflow: 'hidden' }}>
        <table className="admin-table">
          <thead><tr><th>Payment ID</th><th>Booking</th><th>Patient</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th><th>Recorded By</th></tr></thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td style={{ fontFamily: 'monospace', color: '#0D9488', fontWeight: 600, fontSize: '0.78rem' }}>{p.paymentId}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#64748B' }}>{p.bookingDisplayId}</td>
                <td style={{ fontWeight: 600 }}>{p.patientName}</td>
                <td style={{ fontWeight: 700, color: '#059669' }}>₹{p.amount?.toLocaleString('en-IN')}</td>
                <td><span style={{ textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: 700, color: '#64748B' }}>{p.method}</span></td>
                <td><span className={`admin-badge admin-badge-${p.status}`}>{p.status}</span></td>
                <td style={{ fontSize: '0.78rem', color: '#64748B' }}>{p.date}</td>
                <td style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{p.recordedByName}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8}>
              <div className="admin-empty"><IndianRupee size={36} style={{ color: '#CBD5E1', marginBottom: 8 }} /><div className="admin-empty-title">No payments found</div></div>
            </td></tr>}
          </tbody>
        </table>
      </div>

      {/* Add Payment Modal */}
      {showAdd && (
        <div className="admin-modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ fontWeight: 700 }}>Record Payment</div>
              <button onClick={() => setShowAdd(false)} className="admin-btn admin-btn-ghost" style={{ padding: 4 }}><X size={18} /></button>
            </div>
            <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label className="admin-label">Booking *</label>
                <select className="admin-select" value={form.bookingId} onChange={e => setForm({...form, bookingId: e.target.value})}>
                  <option value="">Select booking...</option>
                  {bookings.map(b => <option key={b.id} value={b.id}>{b.bookingId} — {b.patientName} (₹{b.totalAmount})</option>)}
                </select></div>
              <div><label className="admin-label">Amount (₹) *</label>
                <input className="admin-input" type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label className="admin-label">Method</label>
                  <select className="admin-select" value={form.method} onChange={e => setForm({...form, method: e.target.value as any})}>
                    <option value="cash">Cash</option><option value="upi">UPI</option><option value="card">Card</option><option value="online">Online</option>
                  </select></div>
                <div><label className="admin-label">Status</label>
                  <select className="admin-select" value={form.status} onChange={e => setForm({...form, status: e.target.value as any})}>
                    <option value="paid">Paid</option><option value="partial">Partial</option><option value="pending">Pending</option>
                  </select></div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => setShowAdd(false)} className="admin-btn admin-btn-secondary">Cancel</button>
              <button onClick={handleAdd} disabled={!form.bookingId || !form.amount || saving} className="admin-btn admin-btn-primary">
                {saving ? <Loader2 size={15} style={{ animation: 'admin-spin 0.7s linear infinite' }} /> : <Check size={15} />} Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
