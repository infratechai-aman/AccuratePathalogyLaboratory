'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FlaskConical, FileCheck } from 'lucide-react';

const features = [
  {
    icon: FlaskConical,
    title: 'Sample Processing at Self-Owned Certified Laboratories',
    desc: 'under strict quality protocols',
    color: '#009587',
    bg: '#eef6f5',
  },
  {
    icon: FileCheck,
    title: 'Smart, Easy-to-understand, verified reports',
    desc: 'by MD pathologists',
    color: '#d97706',
    bg: '#fef3c7',
  },
];

export default function WhyUsSection() {
  return (
    <section className="section-gap bg-white">
      <div className="container-main">
        <h2 className="text-[26px] font-bold text-[#0D2137] mb-8" style={{ fontFamily: 'Georgia, serif' }}>
          Why Book Tests With Us?
        </h2>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left — feature cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {features.map((f) => (
              <div key={f.title} className="why-card">
                <div className="why-card__icon" style={{ background: f.bg }}>
                  <f.icon size={22} style={{ color: f.color }} />
                </div>
                <p className="text-[14px] text-[#0D2137] leading-relaxed">{f.title} {f.desc}</p>
              </div>
            ))}
          </div>

          {/* Right — Lab photo */}
          <div className="lg:col-span-3 relative rounded-2xl overflow-hidden min-h-[280px]">
            <Image src="/images/lab-photo.png" alt="Our certified laboratory" fill className="object-cover" sizes="(max-width: 768px) 100vw, 60vw" />
          </div>
        </div>
      </div>
    </section>
  );
}
