'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Droplets, Shield, FlaskConical, Pill, Activity, Thermometer, Brain, Bone, Eye, ChevronRight } from 'lucide-react';

const categories = [
  { name: 'Full Body Checkup', icon: Activity, count: 12, color: '#E10B44' },
  { name: 'Heart Health', icon: Heart, count: 8, color: '#EF4444' },
  { name: 'Diabetes', icon: Droplets, count: 6, color: '#3B82F6' },
  { name: 'Thyroid', icon: Shield, count: 5, color: '#8B5CF6' },
  { name: 'Kidney', icon: FlaskConical, count: 4, color: '#00A389' },
  { name: 'Liver', icon: FlaskConical, count: 4, color: '#F59E0B' },
  { name: 'Vitamin', icon: Pill, count: 6, color: '#EC4899' },
  { name: 'Fever Panel', icon: Thermometer, count: 3, color: '#F97316' },
];

export default function PopularCategoriesSection() {
  return (
    <section className="section-padding bg-[#F5F8FC]">
      <div className="container-app">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="section-title">Popular Test Categories</h2>
            <p className="text-sm text-[#6B7280] mt-1">Browse tests by health concern</p>
          </div>
          <Link href="/search" className="text-sm font-semibold text-[#E10B44] hover:underline hidden md:flex items-center gap-1">
            View All <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 md:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/search?category=${encodeURIComponent(cat.name.split(' ')[0])}`}
              className="group bg-white rounded-2xl border border-[#E5E7EB] p-4 md:p-5 hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3" style={{ background: `${cat.color}10` }}>
                <cat.icon size={20} style={{ color: cat.color }} />
              </div>
              <h3 className="text-sm font-bold text-[#0D2137] mb-0.5 group-hover:text-[#E10B44] transition-colors">{cat.name}</h3>
              <p className="text-xs text-[#6B7280]">{cat.count} tests</p>
            </Link>
          ))}
        </div>

        {/* Mobile see all */}
        <div className="md:hidden text-center mt-4">
          <Link href="/search" className="text-sm font-semibold text-[#E10B44]">View All Categories →</Link>
        </div>
      </div>
    </section>
  );
}
