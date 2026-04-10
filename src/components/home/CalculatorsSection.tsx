'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Droplets, Heart, Pill, Scale, Thermometer } from 'lucide-react';

const tools = [
  {
    icon: Scale,
    title: 'Check BMI',
    desc: 'Quickly assess whether your body weight is in a healthy range.',
    href: '/health-tools/bmi',
    color: '#2563eb',
    bg: '#e8f0fb',
  },
  {
    icon: Heart,
    title: 'Heart Health',
    desc: 'Explore a simplified risk view for cardiovascular wellness.',
    href: '/health-tools/health-risk',
    color: '#e31b54',
    bg: '#fde7ee',
  },
  {
    icon: Droplets,
    title: 'Pre-Diabetic',
    desc: 'Assess your diabetes risk and connect it to relevant test packages.',
    href: '/search?category=Diabetes',
    color: '#0b9a8a',
    bg: '#e8f7f3',
  },
  {
    icon: Pill,
    title: 'Vitamin D',
    desc: 'Find out when deficiency testing may be worth booking.',
    href: '/search?category=Vitamin',
    color: '#7c3aed',
    bg: '#f3edff',
  },
  {
    icon: Thermometer,
    title: 'Fever Symptom',
    desc: 'Move from symptoms to likely fever-related test suggestions.',
    href: '/search?category=Fever',
    color: '#d97706',
    bg: '#fff1dc',
  },
];

export default function CalculatorsSection() {
  return (
    <section className="section-gap bg-[#f7f9fc]">
      <div className="container-main">
        <div className="mb-8">
          <span className="section-kicker">Health calculators</span>
          <h2 className="section-title mt-4">Free health tools that mirror the reference card grid.</h2>
          <p className="mt-3 max-w-2xl text-[0.98rem] leading-7 text-[#667085]">
            The cards below now follow the same visual rhythm: icon-led, short copy, generous spacing,
            and a bright interactive surface.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="calc-card group p-5 transition hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(16,30,54,0.14)]"
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: tool.bg }}
              >
                <tool.icon size={24} style={{ color: tool.color }} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-[#101e36]">{tool.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#667085]">{tool.desc}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#e31b54]">
                Try now
                <ArrowRight size={15} className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
