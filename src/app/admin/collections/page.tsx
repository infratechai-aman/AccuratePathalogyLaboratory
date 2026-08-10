'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { getCollections, updateCollectionStatus, createCollection, getCollectionStaff, getBookings } from '@/lib/services/admin-db';
import { generateId } from '@/lib/id-generator';
import { logAudit } from '@/lib/services/audit-service';
import { Collection, CollectionStaff, Booking, COLLECTION_STATUSES, CollectionStatus } from '@/lib/types';
import {
  Search, X, Truck, MapPin, Phone, Calendar, Clock,
  User, Plus, Check, Loader2, ChevronRight
} from 'lucide-react';

export default function CollectionsPage() {
  const { tenantId, staffUser } = useAdmin();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collStaff, setCollStaff] = useState<CollectionStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAssign, setShowAssign] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [assignForm, setAssignForm] = useState({ bookingId: '', staffId: '' });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'collections' | 'staff'>('collections');

  useEffect(() => {
    async function load() {
      try {
        const [c, s, b] = await Promise.all([
          getCollections(tenantId),
          getCollectionStaff(tenantId),
          getBookings(tenantId),
        ]);
        setCollections(c);
        setCollStaff(s);
        setBookings(b.filter(bk => bk.collectionType === 'home_collection'));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [tenantId]);

  const filtered = collections.filter(c => {
    const term = search.toLowerCase();
    const matchSearch = !search || c.patientName?.toLowerCase().includes(term) ||
      c.collectionId?.toLowerCase().includes(term);
    const matchStatus = !filterStatus || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = async (col: Collection, newStatus: CollectionStatus) => {
    try {
      await updateCollectionStatus(col.id, newStatus);
      setCollections(cur => cur.map(c => c.id === col.id ? { ...c, status: newStatus } : c));
      await logAudit(tenantId, staffUser?.uid || '', staffUser?.name || '', staffUser?.role || 'super_admin',
        `Updated collection ${col.collectionId} to ${newStatus}`, 'collection', col.id);
    } catch { alert('Failed to update status'); }
  };

  const handleAssign = async () => {
    if (!assignForm.bookingId || !assignForm.staffId) return;
    setSaving(true);
    try {
      const booking = bookings.find(b => b.id === assignForm.bookingId);
      const staff = collStaff.find(s => s.uid === assignForm.staffId);
      const collectionId = await generateId(tenantId, 'COL');
      const id = await createCollection({
        tenantId, collectionId,
        bookingId: assignForm.bookingId,
        bookingDisplayId: booking?.bookingId || '',
        patientId: booking?.patientId || '',
        patientName: booking?.patientName || '',
        patientPhone: booking?.patientPhone || '',
        address: booking?.address || '',
        date: booking?.date || new Date().toISOString().split('T')[0],
        time: booking?.timeSlot || '',
        assignedStaffId: assignForm.staffId,
        assignedStaffName: staff?.name || '',
        testName: booking?.items?.[0]?.testName || '',
        status: 'assigned',
        createdAt: new Date(), updatedAt: new Date(),
      });
      setCollections([{
        id, tenantId, collectionId,
        bookingId: assignForm.bookingId, bookingDisplayId: booking?.bookingId || '',
        patientId: booking?.patientId || '', patientName: booking?.patientName || '',
        patientPhone: booking?.patientPhone || '', address: booking?.address || '',
        date: booking?.date || '', time: booking?.timeSlot || '',
        assignedStaffId: assignForm.staffId, assignedStaffName: staff?.name || '',
        testName: booking?.items?.[0]?.testName || '', status: 'assigned',
        createdAt: new Date(), updatedAt: new Date(),
      }, ...collections]);
      setShowAssign(false);
      setAssignForm({ bookingId: '', staffId: '' });
    } catch { alert('Failed to assign'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /><p className="admin-loading-text">Loading collections...</p></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Collections</h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: 2 }}>Home sample collection management</p>
        </div>
        <button onClick={() => setShowAssign(true)} className="admin-btn admin-btn-primary">
          <Plus size={15} /> Assign Collection
        </button>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === 'collections' ? 'active' : ''}`} onClick={() => setActiveTab('collections')}>
          Collections
        </button>
        <button className={`admin-tab ${activeTab === 'staff' ? 'active' : ''}`} onClick={() => setActiveTab('staff')}>
          Collection Staff
        </button>
      </div>

      {activeTab === 'collections' && (
        <>
          {/* Status Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
            {COLLECTION_STATUSES.map(s => (
              <button key={s.key} onClick={() => setFilterStatus(filterStatus === s.key ? '' : s.key)}
                className="admin-stat-card" style={{
                  cursor: 'pointer', padding: 12, textAlign: 'left',
                  border: filterStatus === s.key ? `2px solid ${s.color}` : undefined,
                }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>
                  {collections.filter(c => c.status === s.key).length}
                </div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: s.color }}>{s.label}</div>
              </button>
            ))}
          </div>

          <div className="admin-header-search" style={{ maxWidth: 400 }}>
            <Search size={16} style={{ color: '#94A3B8' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search collections..." />
          </div>

          <div className="admin-card" style={{ overflow: 'hidden' }}>
            <div className="admin-card-header">
              <div className="admin-card-title">All Collections</div>
              <span style={{ fontSize: '0.72rem', color: '#64748B', background: '#F1F5F9', padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>
                {filtered.length} records
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr><th>ID</th><th>Patient</th><th>Address</th><th>Date & Time</th><th>Staff</th><th>Test</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontFamily: 'monospace', color: '#0D9488', fontWeight: 600, fontSize: '0.78rem' }}>{c.collectionId}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0F172A' }}>{c.patientName}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{c.patientPhone}</div>
                      </td>
                      <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.82rem', color: '#64748B' }}>
                        {c.address}
                      </td>
                      <td>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{c.date}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{c.time}</div>
                      </td>
                      <td style={{ fontWeight: 600, color: '#0F172A' }}>{c.assignedStaffName}</td>
                      <td>{c.testName}</td>
                      <td>
                        <select value={c.status}
                          onChange={e => handleStatusChange(c, e.target.value as CollectionStatus)}
                          className={`admin-badge admin-badge-${c.status}`}
                          style={{ cursor: 'pointer', border: 'none', outline: 'none', padding: '4px 8px', fontSize: '0.72rem' }}>
                          {COLLECTION_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && <tr><td colSpan={7}>
                    <div className="admin-empty">
                      <Truck size={36} style={{ color: '#CBD5E1', marginBottom: 8 }} />
                      <div className="admin-empty-title">No collections found</div>
                    </div>
                  </td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'staff' && (
        <div className="admin-card" style={{ overflow: 'hidden' }}>
          <div className="admin-card-header">
            <div className="admin-card-title">Collection Staff</div>
          </div>
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Mobile</th><th>Status</th><th>Active</th></tr></thead>
            <tbody>
              {collStaff.map(s => (
                <tr key={s.uid}>
                  <td style={{ fontWeight: 600, color: '#0F172A' }}>{s.name}</td>
                  <td>{s.mobile}</td>
                  <td>{s.onDuty ? <span className="admin-badge admin-badge-completed">On Duty</span> : <span className="admin-badge admin-badge-pending">Off Duty</span>}</td>
                  <td>{s.active ? <span className="admin-badge admin-badge-paid">Active</span> : <span className="admin-badge admin-badge-cancelled">Inactive</span>}</td>
                </tr>
              ))}
              {collStaff.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: 32, color: '#94A3B8' }}>
                No collection staff. Add staff with &quot;Collection Staff&quot; role in Settings.
              </td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Assign Modal */}
      {showAssign && (
        <div className="admin-modal-overlay" onClick={() => setShowAssign(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ fontWeight: 700, color: '#0F172A' }}>Assign Collection</div>
              <button onClick={() => setShowAssign(false)} className="admin-btn admin-btn-ghost" style={{ padding: 4 }}><X size={18} /></button>
            </div>
            <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="admin-label">Select Booking *</label>
                <select className="admin-select" value={assignForm.bookingId}
                  onChange={e => setAssignForm({...assignForm, bookingId: e.target.value})}>
                  <option value="">Choose home collection booking...</option>
                  {bookings.map(b => <option key={b.id} value={b.id}>{b.bookingId} — {b.patientName}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-label">Assign Staff *</label>
                <select className="admin-select" value={assignForm.staffId}
                  onChange={e => setAssignForm({...assignForm, staffId: e.target.value})}>
                  <option value="">Choose staff member...</option>
                  {collStaff.filter(s => s.active).map(s => <option key={s.uid} value={s.uid}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => setShowAssign(false)} className="admin-btn admin-btn-secondary">Cancel</button>
              <button onClick={handleAssign} disabled={!assignForm.bookingId || !assignForm.staffId || saving} className="admin-btn admin-btn-primary">
                {saving ? <Loader2 size={15} style={{ animation: 'admin-spin 0.7s linear infinite' }} /> : <Check size={15} />} Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
