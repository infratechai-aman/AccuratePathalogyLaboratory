'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Brain, MessageSquare, TrendingUp, ChevronRight } from 'lucide-react';

const benefits = [
  { icon: Brain, title: 'AI-Powered Analysis', desc: 'Smart algorithms detect patterns human eyes might miss', color: '#8B5CF6' },
  { icon: FileText, title: 'Easy to Understand', desc: 'Clear visualizations with color-coded health indicators', color: '#3B82F6' },
  { icon: MessageSquare, title: 'Doctor Consultation', desc: 'Free post-report consultation with expert doctors', color: '#00A389' },
  { icon: TrendingUp, title: 'Health Trends', desc: 'Track your parameters over time with trend analysis', color: '#F59E0B' },
];

export default function SmartReportsSection() {
  return (
    <section className="section-padding bg-gradient-to-br from-[#0D2137] via-[#122c47] to-[#1a3a5c] text-white overflow-hidden relative">
      {/* Decorative circles */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-white/3 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-[#E10B44]/5 rounded-full blur-3xl" />

      <div className="container-app relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left — Info */}
          <div>
            <p className="text-[#E10B44] text-xs font-bold uppercase tracking-wider mb-2">Why Choose Us</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Why <span className="text-[#E10B44]">Smart Reports</span>?
            </h2>
            <p className="text-white/60 text-sm mb-8 max-w-md">
              Because health reports should be simple to understand. Our AI-powered smart reports make complex medical data accessible and actionable.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {benefits.map((b) => (
                <div key={b.title} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/8 transition-colors">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: `${b.color}20` }}>
                    <b.icon size={16} style={{ color: b.color }} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{b.title}</h3>
                  <p className="text-[11px] text-white/50 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Visual promo */}
          <div className="flex justify-center">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-sm w-full backdrop-blur-sm">
              {/* Mock report card */}
              <div className="bg-white rounded-2xl p-5 mb-4 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#E10B44]/10 flex items-center justify-center">
                    <FileText size={18} className="text-[#E10B44]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0D2137]">Smart Report</p>
                    <p className="text-[10px] text-[#6B7280]">Full Body Checkup</p>
                  </div>
                </div>
                {/* Mock health indicators */}
                <div className="space-y-2.5">
                  {[
                    { label: 'Hemoglobin', value: '14.2 g/dL', status: 'Normal', color: '#22C55E' },
                    { label: 'Blood Sugar', value: '98 mg/dL', status: 'Normal', color: '#22C55E' },
                    { label: 'Vitamin D', value: '18 ng/mL', status: 'Low', color: '#F59E0B' },
                    { label: 'Cholesterol', value: '220 mg/dL', status: 'High', color: '#EF4444' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-[#F0F2F5] last:border-0">
                      <span className="text-xs text-[#6B7280]">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#0D2137]">{item.value}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${item.color}15`, color: item.color }}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/search" className="flex items-center justify-center gap-2 w-full bg-[#E10B44] hover:bg-[#c8093c] text-white text-sm font-bold py-3 rounded-xl transition-colors">
                Get Your Smart Report <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
