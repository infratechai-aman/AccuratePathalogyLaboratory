'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ClientLayout from '@/components/layout/ClientLayout';
import TestCard from '@/components/tests/TestCard';
import { sampleTests } from '@/lib/sample-data';
import { TEST_CATEGORIES } from '@/lib/types';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'discount'>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  const filteredTests = useMemo(() => {
    let results = sampleTests.filter(t => t.active);
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.parameters.some(p => p.toLowerCase().includes(q)) ||
        t.description.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) results = results.filter(t => t.category === selectedCategory);
    results = results.filter(t => t.price >= priceRange[0] && t.price <= priceRange[1]);
    switch (sortBy) {
      case 'price-low': results.sort((a, b) => a.price - b.price); break;
      case 'price-high': results.sort((a, b) => b.price - a.price); break;
      case 'discount': results.sort((a, b) => b.discount - a.discount); break;
    }
    return results;
  }, [query, selectedCategory, sortBy, priceRange]);

  return (
    <div className="min-h-screen bg-[#F5F8FC]">
      {/* Search + Filter bar */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 md:top-[110px] z-30">
        <div className="container-app py-3">
          {/* Desktop search */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex-1 flex items-center bg-[#F5F8FC] rounded-xl border border-[#E5E7EB] focus-within:border-[#00A389] transition-all">
              <Search size={18} className="ml-4 text-[#9CA3AF]" />
              <input type="text" placeholder="Search tests, packages, categories..."
                value={query} onChange={(e) => setQuery(e.target.value)}
                className="w-full px-3 py-3 bg-transparent outline-none text-sm text-[#0D2137] placeholder:text-[#9CA3AF]" />
              {query && (
                <button onClick={() => setQuery('')} className="mr-3 text-[#9CA3AF] hover:text-[#0D2137]">
                  <X size={16} />
                </button>
              )}
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                showFilters ? 'bg-[#0D2137] text-white border-[#0D2137]' : 'bg-white text-[#0D2137] border-[#E5E7EB] hover:border-[#0D2137]'
              }`}>
              <SlidersHorizontal size={16} /> Filter
            </button>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="mt-3 p-4 bg-[#F5F8FC] rounded-xl border border-[#E5E7EB] animate-fade-in-up">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#6B7280] block mb-1">Sort By</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="px-3 py-2 rounded-lg border border-[#E5E7EB] bg-white text-sm outline-none focus:border-[#00A389]">
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="discount">Highest Discount</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#6B7280] block mb-1">Max Price</label>
                  <div className="flex items-center gap-2">
                    <input type="range" min="0" max="5000" step="100" value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, Number(e.target.value)])} className="w-32" />
                    <span className="text-xs text-[#0D2137] font-medium">₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container-app py-5">
        <div className="flex gap-6">
          {/* Sidebar — desktop only */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="sticky top-[200px] bg-white rounded-2xl border border-[#E5E7EB] p-4">
              <h3 className="text-sm font-bold text-[#0D2137] mb-3">Categories</h3>
              <div className="space-y-0.5">
                <button onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    !selectedCategory ? 'bg-[#E10B44]/10 text-[#E10B44] font-semibold' : 'text-[#6B7280] hover:text-[#0D2137] hover:bg-[#F5F8FC]'
                  }`}>All Tests</button>
                {TEST_CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat ? 'bg-[#E10B44]/10 text-[#E10B44] font-semibold' : 'text-[#6B7280] hover:text-[#0D2137] hover:bg-[#F5F8FC]'
                    }`}>{cat}</button>
                ))}
              </div>
            </div>
          </aside>

          {/* Mobile category pills */}
          <div className="lg:hidden w-full">
            <div className="flex gap-2 overflow-x-auto scroll-container pb-3 mb-4">
              <button onClick={() => setSelectedCategory('')}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium ${
                  !selectedCategory ? 'bg-[#0D2137] text-white' : 'bg-white text-[#6B7280] border border-[#E5E7EB]'
                }`}>All</button>
              {TEST_CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                    selectedCategory === cat ? 'bg-[#0D2137] text-white' : 'bg-white text-[#6B7280] border border-[#E5E7EB]'
                  }`}>{cat}</button>
              ))}
            </div>

            {/* Results heading + sort (mobile) */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#6B7280]">
                {filteredTests.length} test{filteredTests.length !== 1 ? 's' : ''} found
                {selectedCategory && ` in ${selectedCategory}`}
              </p>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-xs px-2 py-1 rounded-lg border border-[#E5E7EB] bg-white text-[#0D2137] outline-none">
                <option value="relevance">Relevance</option>
                <option value="price-low">Price ↑</option>
                <option value="price-high">Price ↓</option>
                <option value="discount">Discount</option>
              </select>
            </div>

            {/* Mobile: Stack test cards vertically */}
            <div className="space-y-3">
              {filteredTests.map((test) => (
                <TestCard key={test.id} test={test} />
              ))}
            </div>

            {filteredTests.length === 0 && (
              <div className="text-center py-16">
                <Search size={48} className="mx-auto text-[#E5E7EB] mb-4" />
                <h3 className="text-lg font-bold text-[#0D2137] mb-1">No tests found</h3>
                <p className="text-[#6B7280] text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>

          {/* Desktop: Results grid */}
          <div className="hidden lg:block flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                {query && <h1 className="text-lg font-bold text-[#0D2137] mb-0.5">Showing results for &quot;{query}&quot;</h1>}
                <p className="text-sm text-[#6B7280]">
                  {filteredTests.length} test{filteredTests.length !== 1 ? 's' : ''} found
                  {selectedCategory && ` in ${selectedCategory}`}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTests.map((test) => (
                <TestCard key={test.id} test={test} />
              ))}
            </div>

            {filteredTests.length === 0 && (
              <div className="text-center py-16">
                <Search size={48} className="mx-auto text-[#E5E7EB] mb-4" />
                <h3 className="text-lg font-bold text-[#0D2137] mb-1">No tests found</h3>
                <p className="text-[#6B7280] text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <ClientLayout>
      <Suspense fallback={<div className="min-h-screen bg-[#F5F8FC]" />}>
        <SearchContent />
      </Suspense>
    </ClientLayout>
  );
}
