'use client';

import React, { useState } from 'react';
import { sampleTests } from '@/lib/sample-data';
import { TEST_CATEGORIES, CITIES, Test } from '@/lib/types';
import { Plus, Edit3, Trash2, Search, X, Save, Eye, EyeOff, Upload } from 'lucide-react';

export default function AdminTestsPage() {
  const [tests, setTests] = useState<Test[]>(sampleTests);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState<Partial<Test>>({
    name: '', price: 0, originalPrice: 0, discount: 0,
    category: 'Full Body', parameters: [], description: '',
    reportTime: 14, isPackage: false, cities: [...CITIES],
    active: true, testsCount: 0,
  });

  const [paramInput, setParamInput] = useState('');

  const filteredTests = tests.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !filterCategory || t.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const openAdd = () => {
    setEditingTest(null);
    setForm({
      name: '', price: 0, originalPrice: 0, discount: 0,
      category: 'Full Body', parameters: [], description: '',
      reportTime: 14, isPackage: false, cities: [...CITIES],
      active: true, testsCount: 0,
    });
    setShowForm(true);
  };

  const openEdit = (test: Test) => {
    setEditingTest(test);
    setForm({ ...test });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name) return;
    const discount = form.originalPrice ? Math.round(((form.originalPrice - (form.price || 0)) / form.originalPrice) * 100) : 0;

    if (editingTest) {
      setTests(tests.map(t => t.id === editingTest.id ? { ...t, ...form, discount, id: t.id } as Test : t));
    } else {
      const newTest: Test = {
        ...form as Test,
        id: 'test-' + Date.now(),
        discount,
        testsCount: form.parameters?.length || 0,
      };
      setTests([newTest, ...tests]);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this test?')) {
      setTests(tests.filter(t => t.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    setTests(tests.map(t => t.id === id ? { ...t, active: !t.active } : t));
  };

  const addParam = () => {
    if (paramInput && form.parameters) {
      setForm({ ...form, parameters: [...form.parameters, paramInput] });
      setParamInput('');
    }
  };

  const removeParam = (idx: number) => {
    setForm({ ...form, parameters: form.parameters?.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/40 text-sm">{filteredTests.length} tests</p>
        </div>
        <button onClick={openAdd} className="btn-primary rounded-xl">
          <Plus size={16} /> Add Test
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="flex-1 flex items-center bg-[#1a2332] rounded-xl border border-white/10 px-4">
          <Search size={16} className="text-white/30" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search tests..." className="w-full px-3 py-3 bg-transparent outline-none text-sm text-white placeholder:text-white/30"
          />
        </div>
        <select
          value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="px-4 py-3 bg-[#1a2332] border border-white/10 rounded-xl text-sm text-white outline-none"
        >
          <option value="">All Categories</option>
          {TEST_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Tests table */}
      <div className="bg-[#1a2332] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-white/40 text-xs uppercase">
                <th className="text-left py-3 px-4">Test</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Discount</th>
                <th className="text-left py-3 px-4">Params</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.map((test) => (
                <tr key={test.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-white font-medium">{test.name}</p>
                      <p className="text-xs text-white/30">{test.isPackage ? 'Package' : 'Test'}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-lg bg-white/5 text-white/60 text-xs">{test.category}</span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-white font-semibold">₹{test.price}</p>
                    <p className="text-xs text-white/30 line-through">₹{test.originalPrice}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-emerald-400 font-semibold">{test.discount}%</span>
                  </td>
                  <td className="py-3 px-4 text-white/60">{test.testsCount || test.parameters.length}</td>
                  <td className="py-3 px-4">
                    <button onClick={() => toggleActive(test.id)}>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        test.active ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'
                      }`}>
                        {test.active ? <Eye size={10} /> : <EyeOff size={10} />}
                        {test.active ? 'Active' : 'Hidden'}
                      </span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(test)} className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-accent transition-colors">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDelete(test.id)} className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-[#1a2332] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-auto border border-white/10">
            <div className="sticky top-0 bg-[#1a2332] p-5 border-b border-white/10 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-white">{editingTest ? 'Edit Test' : 'Add New Test'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-white/10 text-white/50">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5">Test Name</label>
                <input value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-accent" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-1.5">Price (₹)</label>
                  <input type="number" value={form.price || ''} onChange={e => setForm({...form, price: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-1.5">Original Price (₹)</label>
                  <input type="number" value={form.originalPrice || ''} onChange={e => setForm({...form, originalPrice: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-accent" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-1.5">Category</label>
                  <select value={form.category || ''} onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-accent">
                    {TEST_CATEGORIES.map(c => <option key={c} value={c} className="bg-[#1a2332]">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/50 mb-1.5">Report Time (hours)</label>
                  <input type="number" value={form.reportTime || ''} onChange={e => setForm({...form, reportTime: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-accent" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5">Description</label>
                <textarea value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} rows={3}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-accent resize-none" />
              </div>

              {/* Parameters */}
              <div>
                <label className="block text-xs font-semibold text-white/50 mb-1.5">Parameters</label>
                <div className="flex gap-2 mb-2">
                  <input value={paramInput} onChange={e => setParamInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addParam()}
                    placeholder="Add parameter..."
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-accent" />
                  <button onClick={addParam} className="px-4 py-2 bg-accent/20 text-accent rounded-xl text-sm font-semibold hover:bg-accent/30">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.parameters?.map((p, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 rounded-lg text-xs text-white/70">
                      {p}
                      <button onClick={() => removeParam(i)} className="text-white/30 hover:text-red-400"><X size={10} /></button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isPackage || false} onChange={e => setForm({...form, isPackage: e.target.checked})}
                    className="rounded" />
                  <span className="text-sm text-white/70">Package</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.active !== false} onChange={e => setForm({...form, active: e.target.checked})}
                    className="rounded" />
                  <span className="text-sm text-white/70">Active</span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                <button onClick={handleSave} className="btn-primary flex-1 justify-center py-3 rounded-xl">
                  <Save size={16} /> {editingTest ? 'Update Test' : 'Create Test'}
                </button>
                <button onClick={() => setShowForm(false)} className="px-6 py-3 bg-white/5 text-white/60 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
