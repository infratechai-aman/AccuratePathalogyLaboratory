'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { getExpenses, createExpense } from '@/lib/services/admin-db';
import { logAudit } from '@/lib/services/audit-service';
import { Expense, EXPENSE_CATEGORIES, ExpenseCategory } from '@/lib/types';
import { Search, Plus, X, Receipt, Check, Loader2 } from 'lucide-react';

export default function ExpensesPage() {
  const { tenantId, staffUser } = useAdmin();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ category: 'supplies' as ExpenseCategory, amount: '', description: '', date: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    async function load() {
      try { const data = await getExpenses(tenantId); setExpenses(data); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [tenantId]);

  const filtered = expenses.filter(e => {
    const term = search.toLowerCase();
    return (!search || e.description?.toLowerCase().includes(term)) && (!filterCat || e.category === filterCat);
  });

  const today = new Date().toISOString().split('T')[0];
  const todayTotal = expenses.filter(e => e.date === today).reduce((s, e) => s + e.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const handleAdd = async () => {
    if (!form.amount || !form.description) return;
    setSaving(true);
    try {
      const id = await createExpense({
        tenantId, category: form.category, amount: parseFloat(form.amount),
        description: form.description, date: form.date,
        addedBy: staffUser?.uid || '', addedByName: staffUser?.name || '',
        createdAt: new Date(),
      });
      await logAudit(tenantId, staffUser?.uid || '', staffUser?.name || '', staffUser?.role || 'super_admin',
        `Added expense ₹${form.amount} — ${form.description}`, 'expense', id);
      setExpenses([{ id, tenantId, category: form.category, amount: parseFloat(form.amount), description: form.description, date: form.date, addedBy: staffUser?.uid || '', addedByName: staffUser?.name || '', createdAt: new Date() }, ...expenses]);
      setShowAdd(false); setForm({ category: 'supplies', amount: '', description: '', date: today });
    } catch { alert('Failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /><p className="admin-loading-text">Loading expenses...</p></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Expenses</h1>
          <p style={{ fontSize: '0.82rem', color: '#64748B', marginTop: 2 }}>Track lab expenses</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="admin-btn admin-btn-primary"><Plus size={15} /> Add Expense</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Today&apos;s Expenses</div>
          <div className="admin-stat-value" style={{ color: '#DC2626' }}>₹{todayTotal.toLocaleString('en-IN')}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Expenses</div>
          <div className="admin-stat-value">₹{totalExpenses.toLocaleString('en-IN')}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">This Month</div>
          <div className="admin-stat-value">
            ₹{expenses.filter(e => e.date?.startsWith(today.slice(0, 7))).reduce((s, e) => s + e.amount, 0).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <div className="admin-header-search" style={{ flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ color: '#94A3B8' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search expenses..." />
        </div>
        <select className="admin-select" style={{ width: 'auto' }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="">All Categories</option>
          {EXPENSE_CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>
      </div>

      <div className="admin-card" style={{ overflow: 'hidden' }}>
        <table className="admin-table">
          <thead><tr><th>Category</th><th>Description</th><th>Amount</th><th>Date</th><th>Added By</th></tr></thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id}>
                <td><span className="admin-badge admin-badge-system" style={{ textTransform: 'capitalize' }}>{e.category}</span></td>
                <td style={{ fontWeight: 600, color: '#0F172A' }}>{e.description}</td>
                <td style={{ fontWeight: 700, color: '#DC2626' }}>₹{e.amount?.toLocaleString('en-IN')}</td>
                <td style={{ fontSize: '0.78rem', color: '#64748B' }}>{e.date}</td>
                <td style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{e.addedByName}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5}>
              <div className="admin-empty"><Receipt size={36} style={{ color: '#CBD5E1', marginBottom: 8 }} /><div className="admin-empty-title">No expenses recorded</div></div>
            </td></tr>}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="admin-modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div style={{ fontWeight: 700 }}>Add Expense</div>
              <button onClick={() => setShowAdd(false)} className="admin-btn admin-btn-ghost" style={{ padding: 4 }}><X size={18} /></button>
            </div>
            <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label className="admin-label">Category</label>
                <select className="admin-select" value={form.category} onChange={e => setForm({...form, category: e.target.value as any})}>
                  {EXPENSE_CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select></div>
              <div><label className="admin-label">Amount (₹) *</label>
                <input className="admin-input" type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} /></div>
              <div><label className="admin-label">Description *</label>
                <input className="admin-input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="What was the expense for?" /></div>
              <div><label className="admin-label">Date</label>
                <input type="date" className="admin-input" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => setShowAdd(false)} className="admin-btn admin-btn-secondary">Cancel</button>
              <button onClick={handleAdd} disabled={!form.amount || !form.description || saving} className="admin-btn admin-btn-primary">
                {saving ? <Loader2 size={15} style={{ animation: 'admin-spin 0.7s linear infinite' }} /> : <Check size={15} />} Add Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
