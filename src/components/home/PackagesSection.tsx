'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import TestCard from '@/components/tests/TestCard';
import { sampleTests } from '@/lib/sample-data';
import { TEST_CATEGORIES } from '@/lib/types';
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Droplets,
  FlaskConical,
  Heart,
  Pill,
  Shield,
  Thermometer,
} from 'lucide-react';

const categoryConfig: Record<string, { icon: typeof Activity; color: string; bg: string }> = {
  'Full Body': { icon: Activity, color: '#0b9a8a', bg: '#e8f7f3' },
  Heart: { icon: Heart, color: '#e31b54', bg: '#fde7ee' },
  Vitamin: { icon: Pill, color: '#7c3aed', bg: '#f3edff' },
  Fever: { icon: Thermometer, color: '#f97316', bg: '#fff1dc' },
  Diabetes: { icon: Droplets, color: '#2563eb', bg: '#e6f0ff' },
  Thyroid: { icon: Shield, color: '#0b9a8a', bg: '#e8f7f3' },
  Kidney: { icon: FlaskConical, color: '#d97706', bg: '#fff1dc' },
  Liver: { icon: FlaskConical, color: '#e31b54', bg: '#fde7ee' },
};

export default function PackagesSection() {
  const [activeCategory, setActiveCategory] = useState('Full Body');
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredTests = sampleTests.filter((test) => test.active && test.category === activeCategory);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.85;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="section-gap">
      <div className="container-main">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <span className="section-kicker">Doctor curated checkup packages</span>
            <h2 className="section-title mt-4">Health checkup packages designed for modern lab booking.</h2>
            <p className="mt-3 max-w-2xl text-[0.98rem] leading-7 text-[#667085]">
              This section now mirrors the reference flow with category chips, premium cards, and a
              scrollable package deck while preserving your current package data.
            </p>
          </div>

          <Link href="/search" className="hidden text-sm font-bold text-[#e31b54] md:inline-flex">
            See all packages
          </Link>
        </div>

        <div className="mb-7 flex gap-3 overflow-x-auto scroll-x pb-2">
          {TEST_CATEGORIES.slice(0, 8).map((category) => {
            const config = categoryConfig[category] || {
              icon: FlaskConical,
              color: '#667085',
              bg: '#f5f8fc',
            };
            const Icon = config.icon;
            const active = activeCategory === category;

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`cat-pill ${active ? 'active' : ''}`}
              >
                <div
                  className="cat-pill__icon"
                  style={{ background: active ? `${config.color}18` : config.bg }}
                >
                  <Icon size={22} style={{ color: config.color }} />
                </div>
                <span className="cat-pill__label">{category}</span>
              </button>
            );
          })}
        </div>

        <div className="relative">
          <div className="absolute right-0 top-[-58px] hidden items-center gap-2 md:flex">
            <button
              onClick={() => scroll('left')}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d7ddea] bg-white text-[#101e36] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d7ddea] bg-white text-[#101e36] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="flex gap-5 overflow-x-auto scroll-x pb-4">
            {filteredTests.map((test) => (
              <div key={test.id} className="w-[320px] shrink-0 md:w-[356px]">
                <TestCard test={test} />
              </div>
            ))}

            {filteredTests.length === 0 && (
              <div className="surface-card w-full p-8 text-center text-sm text-[#667085]">
                No packages are available in this category yet.
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 md:hidden">
          <Link href="/search" className="text-sm font-bold text-[#e31b54]">
            See all packages
          </Link>
        </div>
      </div>
    </section>
  );
}
