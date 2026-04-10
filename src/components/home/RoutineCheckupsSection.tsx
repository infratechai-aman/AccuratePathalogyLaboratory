'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const menGroups = [
  { label: 'Under 30 yrs', age: 'U30', bg: '#e8f7f3', fg: '#0b9a8a' },
  { label: '30 - 45 yrs', age: '30+', bg: '#e8f0fb', fg: '#2563eb' },
  { label: '45 - 60 yrs', age: '45+', bg: '#fff1dc', fg: '#d97706' },
  { label: 'Above 60 yrs', age: '60+', bg: '#fde7ee', fg: '#e31b54' },
];

const womenGroups = [
  { label: 'Under 30 yrs', age: 'U30', bg: '#f3edff', fg: '#7c3aed' },
  { label: '30 - 45 yrs', age: '30+', bg: '#fde7ee', fg: '#e31b54' },
  { label: '45 - 60 yrs', age: '45+', bg: '#fff1dc', fg: '#d97706' },
  { label: 'Above 60 yrs', age: '60+', bg: '#e8f7f3', fg: '#0b9a8a' },
];

function GroupRow({
  title,
  caption,
  groups,
}: {
  title: string;
  caption: string;
  groups: typeof menGroups;
}) {
  return (
    <div className="routine-card">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-heading text-[1.8rem] font-bold leading-none tracking-[-0.04em] text-[#101e36]">
            {title}
          </h3>
          <p className="mt-2 text-sm text-[#667085]">{caption}</p>
        </div>
        <Link
          href="/search?category=Full+Body"
          className="hidden items-center gap-1 text-sm font-bold text-[#e31b54] sm:inline-flex"
        >
          View all
          <ChevronRight size={15} />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto scroll-x pb-2">
        {groups.map((group) => (
          <Link
            key={group.label}
            href="/search?category=Full+Body"
            className="group min-w-[120px] shrink-0 text-center"
          >
            <div
              className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white bg-white text-center shadow-[0_16px_28px_rgba(16,30,54,0.08)] transition group-hover:-translate-y-1"
              style={{ background: group.bg }}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: group.fg }}>
                  Age
                </p>
                <p className="mt-1 text-xl font-black leading-none" style={{ color: group.fg }}>
                  {group.age}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold text-[#101e36]">{group.label}</p>
          </Link>
        ))}
      </div>

      <Link
        href="/search?category=Full+Body"
        className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#e31b54] sm:hidden"
      >
        View all
        <ChevronRight size={15} />
      </Link>
    </div>
  );
}

export default function RoutineCheckupsSection() {
  return (
    <section className="section-gap pt-2">
      <div className="container-main">
        <div className="grid gap-5 lg:grid-cols-2">
          <GroupRow
            title="Routine health checkups for men"
            caption="Age-filtered package suggestions styled like the reference layout."
            groups={menGroups}
          />
          <GroupRow
            title="Routine health checkups for women"
            caption="Balanced card spacing and circular age selectors for quick exploration."
            groups={womenGroups}
          />
        </div>
      </div>
    </section>
  );
}
