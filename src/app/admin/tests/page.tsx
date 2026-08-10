'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { getTests, createTest, updateTest, deleteTest, getPackages, createPackage, updatePackage, deletePackage } from '@/lib/services/admin-db';
import { logAudit } from '@/lib/services/audit-service';
import { Test, Package, TEST_CATEGORIES } from '@/lib/types';
import {
  Search, Plus, X, FlaskConical, Edit2, Trash2, Check,
  Loader2, ToggleLeft, ToggleRight, Package as PackageIcon
} from 'lucide-react';

export default function TestsPage() {
  const { tenantId, staffUser } = useAdmin();
  const [tests, setTests] = useState<Test[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tests' | 'packages'>('tests');
  const [search, setSearch] = useState('');
  const [showTestModal, setShowTestModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [saving, setSaving] = useState(false);

  const [testForm, setTestForm] = useState({
    name: '', testCode: '', category: 'Routine', price: '',
    sampleType: 'Blood', preparations: '', turnaroundTime: '24 hours',
    description: '', active: true,
  });

  const [pkgForm, setPkgForm] = useState({
    name: '', description: '', price: '', testIds: [] as string[], active: true,
  });

  useEffect(() => {
    async function load() {
      try {
        const [t, p] = await Promise.all([getTests(tenantId), getPackages(tenantId)]);
        setTests(t); setPackages(p);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [tenantId]);

  const filteredTests = tests.filter(t =>
    !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.category?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPackages = packages.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveTest = async () => {
    if (!testForm.name || !testForm.price) return;
    setSaving(true);
    try {
      if (editingTest) {
        await updateTest(editingTest.id, {
          name: testForm.name, testCode: testForm.testCode, category: testForm.category,
          price: parseFloat(testForm.price), sampleType: testForm.sampleType,
          preparations: testForm.preparations.split(',').map(s => s.trim()).filter(Boolean),
          turnaroundTime: testForm.turnaroundTime, description: testForm.description,
          active: testForm.active,
        });
        setTests(cur => cur.map(t => t.id === editingTest.id ? { ...t, ...testForm, price: parseFloat(testForm.price), preparations: testForm.preparations.split(',').map(s => s.trim()) } : t));
      } else {
        const id = await createTest({
          tenantId, name: testForm.name, testCode: testForm.testCode,
          category: testForm.category, price: parseFloat(testForm.price),
          sampleType: testForm.sampleType,
          preparations: testForm.preparations.split(',').map(s => s.trim()).filter(Boolean),
          turnaroundTime: testForm.turnaroundTime, description: testForm.description,
          active: testForm.active, createdAt: new Date(),
        });
        setTests([{ id, tenantId, ...testForm, price: parseFloat(testForm.price), preparations: testForm.preparations.split(',').map(s => s.trim()), createdAt: new Date() } as any, ...tests]);
        await logAudit(tenantId, staffUser?.uid || '', staffUser?.name || '', staffUser?.role || 'super_admin',
          `Created test ${testForm.name}`, 'test', id);
      }
      setShowTestModal(false);
      resetTestForm();
    } catch { alert('Failed to save test'); }
    finally { setSaving(false); }
  };

  const handleSavePackage = async () => {
    if (!pkgForm.name || !pkgForm.price) return;
    setSaving(true);
    try {
      const selectedTests = tests.filter(t => pkgForm.testIds.includes(t.id));
      if (editingPackage) {
        await updatePackage(editingPackage.id, {
          name: pkgForm.name, description: pkgForm.description,
          price: parseFloat(pkgForm.price), testIds: pkgForm.testIds,
          testNames: selectedTests.map(t => t.name), active: pkgForm.active,
        });
        setPackages(cur => cur.map(p => p.id === editingPackage.id ? {
          ...p, ...pkgForm, price: parseFloat(pkgForm.price), testNames: selectedTests.map(t => t.name),
        } : p));
      } else {
        const id = await createPackage({
          tenantId, name: pkgForm.name, description: pkgForm.description,
          price: parseFloat(pkgForm.price), testIds: pkgForm.testIds,
          testNames: selectedTests.map(t => t.name), active: pkgForm.active,
          createdAt: new Date(),
        });
        setPackages([{ id, tenantId, ...pkgForm, price: parseFloat(pkgForm.price), testNames: selectedTests.map(t => t.name), createdAt: new Date() } as any, ...packages]);
      }
      setShowPackageModal(false);
      setPkgForm({ name: '', description: '', price: '', testIds: [], active: true });
    } catch { alert('Failed to save package'); }
    finally { setSaving(false); }
  };

  const handleDeleteTest = async (test: Test) => {
    if (!confirm(`Delete "${test.name}"? It will be deactivated.`)) return;
    await deleteTest(test.id);
    setTests(cur => cur.filter(t => t.id !== test.id));
  };

  const handleToggleTest = async (test: Test) => {
    await updateTest(test.id, { active: !test.active });
    setTests(cur => cur.map(t => t.id === test.id ? { ...t, active: !t.active } : t));
  };

  const resetTestForm = () => {
    setTestForm({ name: '', testCode: '', category: 'Routine', price: '', sampleType: 'Blood', preparations: '', turnaroundTime: '24 hours', description: '', active: true });
    setEditingTest(null);
  };

  const editTest = (test: Test) => {
    setTestForm({
      name: test.name, testCode: test.testCode || '', category: test.category || 'Routine',
      price: test.price.toString(), sampleType: test.sampleType || 'Blood',
      preparations: test.preparations?.join(', ') || '', turnaroundTime: test.turnaroundTime || '24 hours',
      description: test.description || '', active: test.active,
    });
    setEditingTest(test);
    setShowTestModal(true);
  };

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /><p className="admin-loading-text">Loading...</p></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Tests & Packages</h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: 2 }}>Manage lab tests and health packages</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {activeTab === 'tests' ? (
            <button onClick={() => { resetTestForm(); setShowTestModal(true); }} className="admin-btn admin-btn-primary">
              <Plus size={15} /> Add Test
            </button>
          ) : (
            <button onClick={() => { setPkgForm({ name: '', description: '', price: '', testIds: [], active: true }); setEditingPackage(null); setShowPackageModal(true); }} className="admin-btn admin-btn-primary">
              <Plus size={15} /> Create Package
            </button>
          )}
        </div>
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === 'tests' ? 'active' : ''}`} onClick={() => setActiveTab('tests')}>
          Tests ({tests.length})
        </button>
        <button className={`admin-tab ${activeTab === 'packages' ? 'active' : ''}`} onClick={() => setActiveTab('packages')}>
          Packages ({packages.length})
        </button>
      </div>

      <div className="admin-header-search" style={{ maxWidth: 400 }}>
        <Search size={16} style={{ color: '#94A3B8' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${activeTab}...`} />
      </div>

      {activeTab === 'tests' && (
        <div className="admin-card" style={{ overflow: 'hidden' }}>
          <table className="admin-table">
            <thead>
              <tr><th>Test Name</th><th>Code</th><th>Category</th><th>Price</th><th>Sample</th><th>TAT</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filteredTests.map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 600, color: '#0F172A' }}>{t.name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#64748B' }}>{t.testCode || '—'}</td>
                  <td><span className="admin-badge admin-badge-system">{t.category}</span></td>
                  <td style={{ fontWeight: 700, color: '#059669' }}>₹{t.price}</td>
                  <td style={{ fontSize: '0.82rem' }}>{t.sampleType}</td>
                  <td style={{ fontSize: '0.78rem', color: '#64748B' }}>{t.turnaroundTime}</td>
                  <td>
                    <button onClick={() => handleToggleTest(t)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      {t.active ? <ToggleRight size={24} style={{ color: '#0D9488' }} /> : <ToggleLeft size={24} style={{ color: '#94A3B8' }} />}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => editTest(t)} className="admin-btn admin-btn-ghost" style={{ padding: 6 }}><Edit2 size={14} /></button>
                      <button onClick={() => handleDeleteTest(t)} className="admin-btn admin-btn-ghost" style={{ padding: 6, color: '#DC2626' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTests.length === 0 && <tr><td colSpan={8}>
                <div className="admin-empty"><FlaskConical size={36} style={{ color: '#CBD5E1', marginBottom: 8 }} /><div className="admin-empty-title">No tests found</div></div>
              </td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'packages' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filteredPackages.map(pkg => (
            <div key={pkg.id} className="admin-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '1rem' }}>{pkg.name}</div>
                  {pkg.description && <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 2 }}>{pkg.description}</div>}
                </div>
                <span style={{ fontWeight: 800, color: '#059669', fontSize: '1.1rem' }}>₹{pkg.price}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {pkg.testNames?.map((name, i) => (
                  <span key={i} className="admin-badge admin-badge-system">{name}</span>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`admin-badge ${pkg.active ? 'admin-badge-paid' : 'admin-badge-cancelled'}`}>
                  {pkg.active ? 'Active' : 'Inactive'}
                </span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="admin-btn admin-btn-ghost" style={{ padding: 6 }}><Edit2 size={14} /></button>
                  <button onClick={() => deletePackage(pkg.id).then(() => setPackages(cur => cur.filter(p => p.id !== pkg.id)))} className="admin-btn admin-btn-ghost" style={{ padding: 6, color: '#DC2626' }}><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
          {filteredPackages.length === 0 && (
            <div className="admin-card" style={{ gridColumn: '1 / -1' }}>
              <div className="admin-empty"><PackageIcon size={36} style={{ color: '#CBD5E1', marginBottom: 8 }} /><div className="admin-empty-title">No packages yet</div></div>
            </div>
          )}
        </div>
      )}

      {/* Test Modal */}
      {showTestModal && (
        <div className="admin-modal-overlay" onClick={() => setShowTestModal(false)}>
          <div className="admin-modal admin-modal-lg" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ fontWeight: 700, color: '#0F172A' }}>{editingTest ? 'Edit Test' : 'Add New Test'}</div>
              <button onClick={() => setShowTestModal(false)} className="admin-btn admin-btn-ghost" style={{ padding: 4 }}><X size={18} /></button>
            </div>
            <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label className="admin-label">Test Name *</label><input className="admin-input" value={testForm.name} onChange={e => setTestForm({...testForm, name: e.target.value})} /></div>
                <div><label className="admin-label">Test Code</label><input className="admin-input" value={testForm.testCode} onChange={e => setTestForm({...testForm, testCode: e.target.value})} placeholder="e.g., CBC" /></div>
                <div><label className="admin-label">Category</label>
                  <select className="admin-select" value={testForm.category} onChange={e => setTestForm({...testForm, category: e.target.value})}>
                    {TEST_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select></div>
                <div><label className="admin-label">Price (₹) *</label><input className="admin-input" type="number" value={testForm.price} onChange={e => setTestForm({...testForm, price: e.target.value})} /></div>
                <div><label className="admin-label">Sample Type</label>
                  <select className="admin-select" value={testForm.sampleType} onChange={e => setTestForm({...testForm, sampleType: e.target.value})}>
                    <option>Blood</option><option>Urine</option><option>Stool</option><option>Saliva</option><option>Swab</option><option>Other</option>
                  </select></div>
                <div><label className="admin-label">Turnaround Time</label><input className="admin-input" value={testForm.turnaroundTime} onChange={e => setTestForm({...testForm, turnaroundTime: e.target.value})} /></div>
              </div>
              <div><label className="admin-label">Preparations (comma separated)</label>
                <input className="admin-input" value={testForm.preparations} onChange={e => setTestForm({...testForm, preparations: e.target.value})} placeholder="8-12 hours fasting, Morning sample recommended" /></div>
              <div><label className="admin-label">Description</label>
                <input className="admin-input" value={testForm.description} onChange={e => setTestForm({...testForm, description: e.target.value})} /></div>
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => setShowTestModal(false)} className="admin-btn admin-btn-secondary">Cancel</button>
              <button onClick={handleSaveTest} disabled={!testForm.name || !testForm.price || saving} className="admin-btn admin-btn-primary">
                {saving ? <Loader2 size={15} style={{ animation: 'admin-spin 0.7s linear infinite' }} /> : <Check size={15} />}
                {editingTest ? ' Update' : ' Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Package Modal */}
      {showPackageModal && (
        <div className="admin-modal-overlay" onClick={() => setShowPackageModal(false)}>
          <div className="admin-modal admin-modal-lg" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ fontWeight: 700, color: '#0F172A' }}>Create Package</div>
              <button onClick={() => setShowPackageModal(false)} className="admin-btn admin-btn-ghost" style={{ padding: 4 }}><X size={18} /></button>
            </div>
            <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label className="admin-label">Package Name *</label><input className="admin-input" value={pkgForm.name} onChange={e => setPkgForm({...pkgForm, name: e.target.value})} placeholder="e.g., Full Body Checkup" /></div>
                <div><label className="admin-label">Price (₹) *</label><input className="admin-input" type="number" value={pkgForm.price} onChange={e => setPkgForm({...pkgForm, price: e.target.value})} /></div>
              </div>
              <div><label className="admin-label">Description</label><input className="admin-input" value={pkgForm.description} onChange={e => setPkgForm({...pkgForm, description: e.target.value})} /></div>
              <div>
                <label className="admin-label">Select Tests to Include</label>
                <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {tests.filter(t => t.active).map(t => (
                    <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8, cursor: 'pointer', background: pkgForm.testIds.includes(t.id) ? '#F0FDFA' : 'transparent' }}>
                      <input type="checkbox" checked={pkgForm.testIds.includes(t.id)}
                        onChange={() => setPkgForm({...pkgForm, testIds: pkgForm.testIds.includes(t.id) ? pkgForm.testIds.filter(id => id !== t.id) : [...pkgForm.testIds, t.id]})} />
                      <span style={{ flex: 1, fontSize: '0.82rem' }}>{t.name}</span>
                      <span style={{ fontSize: '0.78rem', color: '#059669' }}>₹{t.price}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => setShowPackageModal(false)} className="admin-btn admin-btn-secondary">Cancel</button>
              <button onClick={handleSavePackage} disabled={!pkgForm.name || !pkgForm.price || saving} className="admin-btn admin-btn-primary">
                {saving ? <Loader2 size={15} style={{ animation: 'admin-spin 0.7s linear infinite' }} /> : <Check size={15} />} Create Package
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
