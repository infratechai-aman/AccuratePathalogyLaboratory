'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { getTenant, updateTenant, getStaff, createStaff, updateStaff } from '@/lib/services/admin-db';
import { getAuditLogs } from '@/lib/services/audit-service';
import { logAudit } from '@/lib/services/audit-service';
import { Tenant, StaffUser, StaffRole, AuditLog } from '@/lib/types';
import { ROLE_LABELS } from '@/lib/permissions';
import {
  Settings, Building2, Users, Shield, Bell, Globe, Palette,
  IndianRupee, FileText, Lock, Check, X, Loader2, Plus,
  Edit2, ToggleLeft, ToggleRight, ChevronRight, Clock
} from 'lucide-react';

type SettingsTab = 'lab' | 'staff' | 'notifications' | 'website' | 'security' | 'audit';

export default function SettingsPage() {
  const { tenantId, staffUser, can, refreshUser } = useAdmin();
  const [activeTab, setActiveTab] = useState<SettingsTab>('lab');
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Lab profile form
  const [labForm, setLabForm] = useState({
    labName: '', phone: '', email: '', address: '', city: '',
    state: '', pincode: '', gstNumber: '', licenseNumber: '',
    website: '', tagline: '',
  });

  // Staff modal
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: '', email: '', phone: '', role: 'receptionist' as StaffRole,
  });

  const tabs: { key: SettingsTab; label: string; icon: any }[] = [
    { key: 'lab', label: 'Lab Profile', icon: Building2 },
    { key: 'staff', label: 'Staff & Roles', icon: Users },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'website', label: 'Website Settings', icon: Globe },
    { key: 'security', label: 'Security', icon: Lock },
    { key: 'audit', label: 'Audit Log', icon: Clock },
  ];

  useEffect(() => {
    async function load() {
      try {
        const [t, s, a] = await Promise.all([
          getTenant(tenantId),
          getStaff(tenantId),
          getAuditLogs(tenantId, 50),
        ]);
        if (t) {
          setTenant(t);
          setLabForm({
            labName: t.labName || '', phone: t.phone || '', email: t.email || '',
            address: t.address || '', city: t.city || '', state: t.state || '',
            pincode: t.pincode || '', gstNumber: t.gstNumber || '',
            licenseNumber: t.licenseNumber || '', website: t.websiteUrl || '',
            tagline: t.tagline || '',
          });
        }
        setStaff(s);
        setAuditLogs(a);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [tenantId]);

  const handleSaveLab = async () => {
    setSaving(true);
    try {
      const { website: websiteUrl, ...rest } = labForm;
      await updateTenant(tenantId, { ...rest, websiteUrl } as any);
      await logAudit(tenantId, staffUser?.uid || '', staffUser?.name || '', staffUser?.role || 'super_admin',
        'Updated lab profile', 'settings', tenantId);
      alert('Lab profile saved!');
    } catch { alert('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleAddStaff = async () => {
    if (!staffForm.name || !staffForm.email) return;
    setSaving(true);
    try {
      // In production: Create Firebase Auth user first, then add staff doc
      // For now, we create the staff doc with a placeholder UID
      const placeholderUid = `staff_${Date.now()}`;
      await createStaff(placeholderUid, {
        tenantId, name: staffForm.name, email: staffForm.email,
        phone: staffForm.phone, role: staffForm.role,
        permissions: [], active: true, createdAt: new Date(),
      });
      await logAudit(tenantId, staffUser?.uid || '', staffUser?.name || '', staffUser?.role || 'super_admin',
        `Added staff member ${staffForm.name} as ${ROLE_LABELS[staffForm.role]}`, 'staff', placeholderUid);
      setStaff([...staff, {
        uid: placeholderUid, tenantId, name: staffForm.name, email: staffForm.email,
        phone: staffForm.phone, role: staffForm.role, permissions: [], active: true, createdAt: new Date(),
      }]);
      setShowStaffModal(false);
      setStaffForm({ name: '', email: '', phone: '', role: 'receptionist' });
    } catch { alert('Failed to add staff'); }
    finally { setSaving(false); }
  };

  const toggleStaffActive = async (s: StaffUser) => {
    await updateStaff(s.uid, { active: !s.active });
    setStaff(cur => cur.map(st => st.uid === s.uid ? { ...st, active: !st.active } : st));
  };

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /><p className="admin-loading-text">Loading settings...</p></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Settings</h1>
        <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: 2 }}>Configure your lab and system preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>
        {/* Settings Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`admin-nav-item ${activeTab === tab.key ? 'active' : ''}`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div>
          {/* Lab Profile */}
          {activeTab === 'lab' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-title">Lab Profile</div>
                <button onClick={handleSaveLab} disabled={saving} className="admin-btn admin-btn-primary">
                  {saving ? <Loader2 size={15} style={{ animation: 'admin-spin 0.7s linear infinite' }} /> : <Check size={15} />} Save
                </button>
              </div>
              <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div><label className="admin-label">Lab Name</label>
                    <input className="admin-input" value={labForm.labName} onChange={e => setLabForm({...labForm, labName: e.target.value})} /></div>
                  <div><label className="admin-label">Tagline</label>
                    <input className="admin-input" value={labForm.tagline} onChange={e => setLabForm({...labForm, tagline: e.target.value})} placeholder="Your lab tagline" /></div>
                  <div><label className="admin-label">Phone</label>
                    <input className="admin-input" value={labForm.phone} onChange={e => setLabForm({...labForm, phone: e.target.value})} /></div>
                  <div><label className="admin-label">Email</label>
                    <input className="admin-input" value={labForm.email} onChange={e => setLabForm({...labForm, email: e.target.value})} /></div>
                  <div style={{ gridColumn: '1 / -1' }}><label className="admin-label">Address</label>
                    <input className="admin-input" value={labForm.address} onChange={e => setLabForm({...labForm, address: e.target.value})} /></div>
                  <div><label className="admin-label">City</label>
                    <input className="admin-input" value={labForm.city} onChange={e => setLabForm({...labForm, city: e.target.value})} /></div>
                  <div><label className="admin-label">State</label>
                    <input className="admin-input" value={labForm.state} onChange={e => setLabForm({...labForm, state: e.target.value})} /></div>
                  <div><label className="admin-label">PIN Code</label>
                    <input className="admin-input" value={labForm.pincode} onChange={e => setLabForm({...labForm, pincode: e.target.value})} /></div>
                  <div><label className="admin-label">Website</label>
                    <input className="admin-input" value={labForm.website} onChange={e => setLabForm({...labForm, website: e.target.value})} /></div>
                  <div><label className="admin-label">GST Number</label>
                    <input className="admin-input" value={labForm.gstNumber} onChange={e => setLabForm({...labForm, gstNumber: e.target.value})} /></div>
                  <div><label className="admin-label">License Number</label>
                    <input className="admin-input" value={labForm.licenseNumber} onChange={e => setLabForm({...labForm, licenseNumber: e.target.value})} /></div>
                </div>
              </div>
            </div>
          )}

          {/* Staff & Roles */}
          {activeTab === 'staff' && (
            <div className="admin-card" style={{ overflow: 'hidden' }}>
              <div className="admin-card-header">
                <div className="admin-card-title">Staff Members</div>
                <button onClick={() => setShowStaffModal(true)} className="admin-btn admin-btn-primary">
                  <Plus size={15} /> Add Staff
                </button>
              </div>
              <table className="admin-table">
                <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {staff.map(s => (
                    <tr key={s.uid}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%', background: '#CCFBF1',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#0D9488', fontWeight: 700, fontSize: '0.78rem',
                          }}>{s.name?.charAt(0)}</div>
                          <span style={{ fontWeight: 600, color: '#0F172A' }}>{s.name}</span>
                        </div>
                      </td>
                      <td style={{ color: '#64748B', fontSize: '0.82rem' }}>{s.email}</td>
                      <td style={{ color: '#64748B', fontSize: '0.82rem' }}>{s.phone}</td>
                      <td><span className="admin-badge admin-badge-system">{ROLE_LABELS[s.role]}</span></td>
                      <td>
                        <button onClick={() => toggleStaffActive(s)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                          {s.active ? <ToggleRight size={24} style={{ color: '#0D9488' }} /> : <ToggleLeft size={24} style={{ color: '#94A3B8' }} />}
                        </button>
                      </td>
                      <td>
                        <button className="admin-btn admin-btn-ghost" style={{ padding: 6 }}><Edit2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                  {staff.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: '#94A3B8' }}>
                    No staff members. Add your first staff member.
                  </td></tr>}
                </tbody>
              </table>

              {/* Role Permissions Info */}
              <div style={{ padding: 20, borderTop: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>Role Permissions</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {(Object.entries(ROLE_LABELS) as [StaffRole, string][]).map(([role, label]) => (
                    <div key={role} style={{ padding: 14, background: '#F8FAFC', borderRadius: 10 }}>
                      <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {role === 'super_admin' ? 'Full access to all features' :
                         role === 'receptionist' ? 'Bookings, patients, payments, slots' :
                         role === 'lab_technician' ? 'Reports upload & verify, assigned bookings' :
                         'Home collection assignments & status updates'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-title">Notification Settings</div>
              </div>
              <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  Configure when patients receive WhatsApp, Email, and System notifications.
                </p>
                {[
                  { event: 'Booking Confirmed', desc: 'When a new booking is created', enabled: true },
                  { event: 'Payment Received', desc: 'When payment is recorded', enabled: true },
                  { event: 'Sample Collected', desc: 'When sample is collected', enabled: true },
                  { event: 'Collection Scheduled', desc: 'When home collection is assigned', enabled: true },
                  { event: 'Report Uploaded', desc: 'When a report is uploaded', enabled: false },
                  { event: 'Report Verified', desc: 'When a report is verified', enabled: false },
                  { event: 'Report Ready', desc: 'When report is marked ready for delivery', enabled: true },
                  { event: 'Report Delivered', desc: 'When report is delivered to patient', enabled: true },
                ].map(n => (
                  <div key={n.event} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: 14, background: '#F8FAFC', borderRadius: 10,
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.875rem' }}>{n.event}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{n.desc}</div>
                    </div>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      {n.enabled ? <ToggleRight size={28} style={{ color: '#0D9488' }} /> : <ToggleLeft size={28} style={{ color: '#CBD5E1' }} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Website Settings */}
          {activeTab === 'website' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-title">Website Settings</div>
              </div>
              <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: '#F0FDFA', border: '1px solid #CCFBF1', borderRadius: 12, padding: 16 }}>
                  <div style={{ fontWeight: 700, color: '#0D9488', marginBottom: 4 }}>SaaS Website Integration</div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                    Your lab website is powered by InfraTechAI. Tests, packages, slots, and booking availability
                    are automatically synced from this admin panel to your public-facing website.
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[
                    { label: 'Online Booking', desc: 'Allow patients to book online', enabled: true },
                    { label: 'Home Collection', desc: 'Show home collection option', enabled: true },
                    { label: 'Show Prices', desc: 'Display test prices on website', enabled: true },
                    { label: 'Show Reviews', desc: 'Display patient reviews', enabled: true },
                  ].map(s => (
                    <div key={s.label} style={{ padding: 14, background: '#F8FAFC', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.82rem' }}>{s.label}</div>
                        <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>{s.desc}</div>
                      </div>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        {s.enabled ? <ToggleRight size={24} style={{ color: '#0D9488' }} /> : <ToggleLeft size={24} style={{ color: '#CBD5E1' }} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-title">Security Settings</div>
              </div>
              <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 12, padding: 16 }}>
                  <div style={{ fontWeight: 700, color: '#D97706', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Shield size={16} /> Security Notice
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#92400E' }}>
                    All admin actions are logged. Firestore Security Rules enforce tenant isolation.
                    Staff can only access data for their assigned tenant.
                  </div>
                </div>
                {[
                  { label: 'Two-Factor Authentication', desc: 'Require 2FA for admin login', enabled: false },
                  { label: 'Session Timeout', desc: 'Auto-logout after 30 minutes of inactivity', enabled: true },
                  { label: 'IP Whitelisting', desc: 'Restrict admin access to specific IPs', enabled: false },
                  { label: 'Audit Logging', desc: 'Record all admin actions', enabled: true },
                ].map(s => (
                  <div key={s.label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: 14, background: '#F8FAFC', borderRadius: 10,
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.875rem' }}>{s.label}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{s.desc}</div>
                    </div>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      {s.enabled ? <ToggleRight size={28} style={{ color: '#0D9488' }} /> : <ToggleLeft size={28} style={{ color: '#CBD5E1' }} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit Log */}
          {activeTab === 'audit' && (
            <div className="admin-card" style={{ overflow: 'hidden' }}>
              <div className="admin-card-header">
                <div className="admin-card-title">Audit Log</div>
                <span style={{ fontSize: '0.72rem', color: '#64748B', background: '#F1F5F9', padding: '4px 10px', borderRadius: 20, fontWeight: 600 }}>
                  Last 50 actions
                </span>
              </div>
              <table className="admin-table">
                <thead><tr><th>User</th><th>Role</th><th>Action</th><th>Record</th><th>Time</th></tr></thead>
                <tbody>
                  {auditLogs.map(log => (
                    <tr key={log.id}>
                      <td style={{ fontWeight: 600, color: '#0F172A' }}>{log.userName}</td>
                      <td><span className="admin-badge admin-badge-system">{log.userRole}</span></td>
                      <td style={{ fontSize: '0.82rem', color: '#334155' }}>{log.action}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#94A3B8' }}>{log.recordType}</td>
                      <td style={{ fontSize: '0.72rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                        {log.timestamp instanceof Date ? log.timestamp.toLocaleString('en-IN') : '—'}
                      </td>
                    </tr>
                  ))}
                  {auditLogs.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#94A3B8' }}>
                    No audit logs yet. Actions will be recorded automatically.
                  </td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Staff Modal */}
      {showStaffModal && (
        <div className="admin-modal-overlay" onClick={() => setShowStaffModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ fontWeight: 700, color: '#0F172A' }}>Add Staff Member</div>
              <button onClick={() => setShowStaffModal(false)} className="admin-btn admin-btn-ghost" style={{ padding: 4 }}><X size={18} /></button>
            </div>
            <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label className="admin-label">Full Name *</label>
                <input className="admin-input" value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} placeholder="Staff name" /></div>
              <div><label className="admin-label">Email *</label>
                <input className="admin-input" type="email" value={staffForm.email} onChange={e => setStaffForm({...staffForm, email: e.target.value})} placeholder="staff@lab.com" /></div>
              <div><label className="admin-label">Phone</label>
                <input className="admin-input" value={staffForm.phone} onChange={e => setStaffForm({...staffForm, phone: e.target.value})} placeholder="10-digit mobile" /></div>
              <div><label className="admin-label">Role *</label>
                <select className="admin-select" value={staffForm.role} onChange={e => setStaffForm({...staffForm, role: e.target.value as StaffRole})}>
                  {(Object.entries(ROLE_LABELS) as [StaffRole, string][]).map(([role, label]) => (
                    <option key={role} value={role}>{label}</option>
                  ))}
                </select></div>
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => setShowStaffModal(false)} className="admin-btn admin-btn-secondary">Cancel</button>
              <button onClick={handleAddStaff} disabled={!staffForm.name || !staffForm.email || saving} className="admin-btn admin-btn-primary">
                {saving ? <Loader2 size={15} style={{ animation: 'admin-spin 0.7s linear infinite' }} /> : <Check size={15} />} Add Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
