'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Activity, Building2, CheckCircle2, MapPin, Users } from 'lucide-react';

const stats = [
  { icon: Users, value: '1 Crore+', label: 'Lives touched', color: '#e31b54', bg: '#fde7ee' },
  { icon: MapPin, value: '220+', label: 'Cities served', color: '#0b9a8a', bg: '#e8f7f3' },
  { icon: Building2, value: '80+', label: 'Certified lab hubs', color: '#2563eb', bg: '#e8f0fb' },
  { icon: Activity, value: '1500+', label: 'Collection experts', color: '#d97706', bg: '#fff1dc' },
];

const trustPoints = [
  'Doctor-curated packages for preventive and routine care',
  'Doorstep collection with temperature-aware sample handling',
  'Smart reports designed to feel easier and faster to read',
  'Affordable packages with transparent discount presentation',
];

export default function TrustSection() {
  return (
    <>
      <section className="section-gap">
        <div className="container-main">
          <div className="overflow-hidden rounded-[34px] border border-[#f2dccc] bg-[linear-gradient(135deg,#fff6ea_0%,#fff2e4_42%,#fff9f2_100%)] shadow-[0_24px_50px_rgba(16,30,54,0.08)]">
            <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
              <div className="relative min-h-[320px] overflow-hidden lg:min-h-[420px]">
                <Image
                  src="/images/lab-photo.png"
                  alt="AccurateLabs facility"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,30,54,0.06)_0%,rgba(16,30,54,0.42)_100%)]" />
                <div className="absolute inset-x-6 bottom-6 rounded-[24px] border border-white/15 bg-white/14 p-5 backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Trusted diagnostics</p>
                  <p className="mt-2 font-heading text-3xl font-bold leading-none text-white">
                    Personalized for your patients
                  </p>
                </div>
              </div>

              <div className="px-6 py-8 md:px-8 md:py-10">
                <span className="section-kicker">Why this layout works</span>
                <h2 className="section-title mt-4">Trusted by millions. Personalized for you.</h2>
                <p className="mt-4 text-[1rem] leading-7 text-[#667085]">
                  This block is styled to echo the high-trust section from Redcliffe, with a warm
                  testimonial-like tone, visual depth, and strong conversion placement.
                </p>

                <div className="mt-6 space-y-4">
                  {trustPoints.map((point) => (
                    <div key={point} className="flex items-start gap-3">
                      <CheckCircle2 size={19} className="mt-1 shrink-0 text-[#0b9a8a]" />
                      <span className="text-sm leading-7 text-[#334155]">{point}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/search" className="btn-primary">
                    Book your test today
                  </Link>
                  <Link href="/search?category=Full+Body" className="btn-outline">
                    Explore packages
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-gap pt-0">
        <div className="container-main">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <span className="section-kicker">Healthcare reach</span>
              <h2 className="section-title mt-4">Quality healthcare spread across your service map.</h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="stat-card__icon" style={{ background: stat.bg }}>
                  <stat.icon size={24} style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="stat-card__value">{stat.value}</p>
                  <p className="stat-card__label">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
