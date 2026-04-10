'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Mic, ScanFace, Search } from 'lucide-react';

const heroHighlights = [
  'Doctor-curated packages for all age groups',
  'Smart reports with quick health insights',
  'Home sample collection and live support',
];

const quickTiles = [
  {
    title: 'Face Scan',
    note: 'New',
    href: '/search',
    icon: ScanFace,
    tone: 'bg-[#e8f7f3] text-[#0b9a8a]',
  },
  {
    title: 'Create Your Own Package',
    note: 'Customise',
    href: '/search?category=Full+Body',
    icon: Search,
    tone: 'bg-[#fde7ee] text-[#e31b54]',
  },
];

export default function HeroSection() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <section className="hero-section">
      <div className="container-main">
        <div className="hero-shell">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative z-[1]">
              <span className="section-kicker">Leading diagnostics for preventive care</span>
              <h1 className="font-heading mt-5 max-w-[10ch] text-[clamp(2.4rem,5vw,4.7rem)] font-bold leading-[0.95] tracking-[-0.05em] text-[#101e36]">
                Looking for a test?
              </h1>
              <p className="mt-5 max-w-xl text-[1rem] leading-7 text-[#667085] md:text-[1.05rem]">
                Book lab tests, full body checkups, and doorstep collection with a homepage experience
                styled around the premium diagnostic flow your client wants.
              </p>

              <form onSubmit={handleSearch} className="mt-7">
                <div className="hero-search">
                  <Search size={20} className="shrink-0 text-[#7d8798]" />
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search tests, packages, vitamins, fever panel..."
                  />
                  <div className="hidden items-center gap-2 border-l border-[#e8edf5] pl-3 md:flex">
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f8fc] text-[#e31b54] transition hover:bg-[#fde7ee]"
                      aria-label="Voice search"
                    >
                      <Mic size={18} />
                    </button>
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f8fc] text-[#0b9a8a] transition hover:bg-[#e8f7f3]"
                      aria-label="Scan"
                    >
                      <ScanFace size={18} />
                    </button>
                  </div>
                  <button type="submit" className="btn-primary px-5 py-3 text-sm md:px-7">
                    Search
                  </button>
                </div>
              </form>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {quickTiles.map((tile) => (
                  <Link
                    key={tile.title}
                    href={tile.href}
                    className="glass-chip justify-between rounded-[24px] px-4 py-4 transition hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(16,30,54,0.12)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tile.tone}`}>
                        <tile.icon size={22} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#101e36]">{tile.title}</p>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7d8798]">
                          {tile.note}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-[#7d8798]" />
                  </Link>
                ))}
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {heroHighlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-[22px] border border-[#d7ddea] bg-white/82 px-4 py-4 text-sm font-semibold text-[#334155] shadow-[0_12px_26px_rgba(16,30,54,0.06)]"
                  >
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#fde7ee]">
                      <span className="text-sm font-black text-[#e31b54]">+</span>
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-[1]">
              <div className="relative overflow-hidden rounded-[34px] border border-[#d7ddea] bg-[linear-gradient(180deg,#173057_0%,#101e36_100%)] px-6 pb-6 pt-7 text-white shadow-[0_30px_60px_rgba(16,30,54,0.2)]">
                <div className="flex items-start justify-between gap-6">
                  <div className="max-w-[280px]">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/62">
                      Delivering complete care
                    </p>
                    <p className="font-heading mt-3 text-4xl font-bold leading-none tracking-[-0.05em]">
                      4X value
                    </p>
                    <p className="mt-3 text-sm leading-6 text-white/70">
                      Smart reports, AI-assisted review, consultation support, and preventive package design
                      in one booking flow.
                    </p>
                  </div>

                  <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full border border-white/12 bg-white/8 text-center shadow-[0_18px_36px_rgba(0,0,0,0.16)]">
                    <span className="text-4xl font-black leading-none">4X</span>
                    <span className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/68">
                      Value
                    </span>
                  </div>
                </div>

                <div className="mt-8 grid items-center gap-6 md:grid-cols-[0.9fr_1.1fr]">
                  <div className="relative mx-auto h-[280px] w-full max-w-[260px]">
                    <div className="absolute inset-x-6 bottom-1 h-12 rounded-full bg-[#081328]/28 blur-2xl" />
                    <Image
                      src="/images/hero-doctor.png"
                      alt="AccurateLabs healthcare professional"
                      fill
                      priority
                      className="object-contain"
                      sizes="(max-width: 768px) 240px, 320px"
                    />
                  </div>

                  <div className="space-y-3">
                    {['Smart Reports', 'AI Assistance', 'Report Consultation', 'Diet Plan Support'].map(
                      (item) => (
                        <div
                          key={item}
                          className="flex items-center justify-between rounded-[22px] border border-white/10 bg-white/8 px-4 py-3"
                        >
                          <span className="text-sm font-semibold tracking-[0.04em] text-white/92">{item}</span>
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fde7ee] text-[#e31b54]">
                            <span className="text-base font-black">+</span>
                          </span>
                        </div>
                      )
                    )}

                    <Link href="/search" className="btn-primary mt-2 w-full justify-center py-3.5">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
