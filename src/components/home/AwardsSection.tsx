'use client';

import React from 'react';
import { Award, Star } from 'lucide-react';

const awards = [
  {
    theme: 'HealthTech & Innovation',
    title: "Center of Excellence for Women's Health",
    org: 'Times Internet',
  },
  {
    theme: 'Quality Diagnostics',
    title: 'Best use of technology in preventive diagnostics',
    org: 'Financial Express',
  },
  {
    theme: 'Customer Experience',
    title: 'Patient-centric lab experience and digital journey design',
    org: 'Healthcare Awards',
  },
  {
    theme: 'Growth & Innovation',
    title: 'Leading diagnostic chain for service accessibility',
    org: 'Innovation Summit',
  },
];

export default function AwardsSection() {
  return (
    <section className="section-gap">
      <div className="container-main">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="section-kicker">Awards and recognition</span>
            <h2 className="section-title mt-4">Recognition blocks styled like the reference carousel.</h2>
            <p className="mt-3 max-w-2xl text-[0.98rem] leading-7 text-[#667085]">
              This keeps the strong awards section feel while using safe placeholder content for your client
              demo instead of copying third-party award assets.
            </p>
          </div>
          <div className="hidden rounded-full bg-[#fde7ee] p-4 text-[#e31b54] md:block">
            <Award size={26} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {awards.map((award) => (
            <article key={award.title} className="award-card p-5 transition hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(16,30,54,0.12)]">
              <div className="flex items-center gap-1 text-[#f59e0b]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={14} fill="currentColor" />
                ))}
              </div>

              <p className="mt-5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#7d8798]">
                {award.theme}
              </p>
              <h3 className="mt-3 text-lg font-bold leading-7 text-[#101e36]">{award.title}</h3>
              <p className="mt-4 text-sm font-semibold text-[#e31b54]">{award.org}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
