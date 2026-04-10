'use client';

import React from 'react';
import Image from 'next/image';

const steps = [
  {
    label: 'BOOK',
    tone: { bg: '#fde7ee', fg: '#e31b54' },
    title: 'Start your online booking',
    desc: 'Choose a package or test, add patient details, and schedule a home collection slot.',
    image: '/images/step-booking.png',
  },
  {
    label: 'TRACK',
    tone: { bg: '#e8f0fb', fg: '#2563eb' },
    title: 'Live tracking and support',
    desc: 'Stay updated with collection timing and booking status through a simple guided flow.',
    image: '/images/step-tracking.png',
  },
  {
    label: 'COLLECT',
    tone: { bg: '#e8f7f3', fg: '#0b9a8a' },
    title: 'Sample collection',
    desc: 'Certified professionals visit with careful doorstep sample handling and hygiene protocols.',
    image: '/images/sample-collection.png',
  },
  {
    label: 'REPORT',
    tone: { bg: '#fff1dc', fg: '#d97706' },
    title: 'Doctor-verified smart reports',
    desc: 'Reports are shared fast with simplified summaries, trends, and easy-to-read highlights.',
    image: '/images/step-report.png',
  },
  {
    label: 'CONSULT',
    tone: { bg: '#f3edff', fg: '#7c3aed' },
    title: 'Consult and act',
    desc: 'Continue the care journey with expert help and follow-up next steps after results arrive.',
    image: '/images/hero-doctor.png',
  },
];

export default function StepsSection() {
  return (
    <section className="section-gap">
      <div className="container-main">
        <div className="mb-8">
          <span className="section-kicker">Simple doorstep journey</span>
          <h2 className="section-title mt-4">5 simple steps to manage your health.</h2>
          <p className="mt-3 max-w-2xl text-[0.98rem] leading-7 text-[#667085]">
            The layout, card rhythm, and image-led flow here are tuned to match the reference site more
            closely while still using your project&apos;s assets.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {steps.map((step, index) => (
            <article key={step.label} className="step-card">
              <div className="p-4 pb-0">
                <span className="step-card__label" style={{ background: step.tone.bg, color: step.tone.fg }}>
                  {step.label}
                </span>
              </div>

              <div className="relative mt-4 h-[180px] overflow-hidden md:h-[200px]">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 20vw"
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#101e36]/55 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/92 text-sm font-black text-[#101e36]">
                    {index + 1}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold leading-6 text-[#101e36]">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#667085]">{step.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
