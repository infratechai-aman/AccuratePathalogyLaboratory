'use client';

import React, { useState } from 'react';
import { sampleTests } from '@/lib/sample-data';
import { TEST_CATEGORIES, CITIES, Test } from '@/lib/types';
import { Plus, Edit3, Trash2, Search, X, Save, Eye, EyeOff } from 'lucide-react';

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
          <p className="text-gray-500 font-semibold text-sm bg-white px-4 py-2 border border-gray-200 rounded-xl shadow-sm">{filteredTests.length} tests</p>
        </div>
        <button onClick={openAdd} className="bg-[#0A2540] hover:bg-[#0e3460] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-sm">
          <Plus size={16} /> Add Test
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="flex-1 flex items-center bg-white rounded-xl border border-gray-200 px-4 shadow-sm">
          <Search size={16} className="text-gray-400" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search tests..." className="w-full px-3 py-3 bg-transparent outline-none text-sm text-[#0A2540] placeholder:text-gray-400 font-medium"
          />
        </div>
        <select
          value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-[#0A2540] font-semibold outline-none shadow-sm focus:border-[#0A2540]"
        >
          <option value="">All Categories</option>
          {TEST_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Tests table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase font-bold">
                <th className="text-left py-3 px-5">Test</th>
                <th className="text-left py-3 px-5">Category</th>
                <th className="text-left py-3 px-5">Price</th>
                <th className="text-left py-3 px-5">Discount</th>
                <th className="text-left py-3 px-5">Params</th>
                <th className="text-left py-3 px-5">Status</th>
                <th className="text-right py-3 px-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.map((test) => (
                <tr key={test.id} className="border-b border-gray-50 hover:bg-blue-50/50 transition-colors">
                  <td className="py-4 px-5">
                    <div>
                      <p className="text-[#0A2540] font-bold">{test.name}</p>
                      <p className="text-xs text-gray-400 font-medium">{test.isPackage ? 'Package' : 'Test'}</p>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 font-semibold text-xs">{test.category}</span>
                  </td>
                  <td className="py-4 px-5">
                    <p className="text-[#0A2540] font-bold">₹{test.price}</p>
                    <p className="text-xs text-gray-400 font-semibold line-through">₹{test.originalPrice}</p>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-emerald-600 font-black">{test.discount}%</span>
                  </td>
                  <td className="py-4 px-5 text-gray-600 font-semibold">{test.testsCount || test.parameters.length}</td>
                  <td className="py-4 px-5">
                    <button onClick={() => toggleActive(test.id)}>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        test.active ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
                      }`}>
                        {test.active ? <Eye size={12} /> : <EyeOff size={12} />}
                        {test.active ? 'Active' : 'Hidden'}
                      </span>
                    </button>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(test)} className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-[#0A2540] transition-colors border border-gray-100">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDelete(test.id)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors border border-red-50">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTests.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    No tests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-auto shadow-2xl">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between z-10 shadow-sm">
              <h2 className="text-lg font-black text-[#0A2540]">{editingTest ? 'Edit Test' : 'Add New Test'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Test Name</label>
                <input value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#0A2540] text-sm font-medium outline-none focus:border-[#0A2540] focus:bg-white transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Price (₹)</label>
                  <input type="number" value={form.price || ''} onChange={e => setForm({...form, price: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#0A2540] text-sm font-medium outline-none focus:border-[#0A2540] focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Original Price (₹)</label>
                  <input type="number" value={form.originalPrice || ''} onChange={e => setForm({...form, originalPrice: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#0A2540] text-sm font-medium outline-none focus:border-[#0A2540] focus:bg-white transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Category</label>
                  <select value={form.category || ''} onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#0A2540] text-sm font-medium outline-none focus:border-[#0A2540] focus:bg-white transition-colors">
                    {TEST_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Report Time (hours)</label>
                  <input type="number" value={form.reportTime || ''} onChange={e => setForm({...form, reportTime: Number(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#0A2540] text-sm font-medium outline-none focus:border-[#0A2540] focus:bg-white transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Description</label>
                <textarea value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#0A2540] text-sm font-medium outline-none focus:border-[#0A2540] focus:bg-white transition-colors resize-none" />
              </div>

              {/* Parameters */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Parameters</label>
                <div className="flex gap-2 mb-3">
                  <input value={paramInput} onChange={e => setParamInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addParam()}
                    placeholder="Type parameter and press Enter..."
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[#0A2540] text-sm font-medium outline-none focus:border-[#0A2540] focus:bg-white transition-colors" />
                  <button onClick={addParam} className="px-5 py-2.5 bg-[#0A2540] text-white rounded-xl text-sm font-bold hover:bg-[#0e3460] transition-colors shadow-sm">
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.parameters?.map((p, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-xs font-semibold text-[#0A2540]">
                      {p}
                      <button onClick={() => removeParam(i)} className="text-gray-400 hover:text-red-500 transition-colors ml-1"><X size={12} /></button>
                    </span>
                  ))}
                  {form.parameters?.length === 0 && (
                    <span className="text-xs text-gray-400 italic">No parameters added.</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isPackage || false} onChange={e => setForm({...form, isPackage: e.target.checked})}
                    className="rounded text-[#0A2540] w-4 h-4 cursor-pointer" />
                  <span className="text-sm font-bold text-[#0A2540]">Is Package</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.active !== false} onChange={e => setForm({...form, active: e.target.checked})}
                    className="rounded text-[#0A2540] w-4 h-4 cursor-pointer" />
                  <span className="text-sm font-bold text-[#0A2540]">Active (Visible)</span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
                <button onClick={handleSave} className="bg-[#E53E3E] text-white flex-1 justify-center py-3.5 rounded-xl text-sm font-black hover:bg-red-700 transition-colors shadow-sm flex items-center gap-2">
                  <Save size={16} /> {editingTest ? 'Update Test' : 'Create Test'}
                </button>
                <button onClick={() => setShowForm(false)} className="px-8 py-3.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors">
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
