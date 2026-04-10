'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, FlaskConical, Plus } from 'lucide-react';

export default function CustomPackageSection() {
  return (
    <section className="section-gap pt-2">
      <div className="container-main">
        <div className="overflow-hidden rounded-[34px] border border-[#f4dac7] bg-[linear-gradient(135deg,#fff4e8_0%,#fff0df_45%,#fff8ef_100%)] p-7 shadow-[0_24px_50px_rgba(16,30,54,0.08)] md:p-9">
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <span className="section-kicker">Customise</span>
              <h2 className="section-title mt-4">Create your own package.</h2>
              <p className="mt-4 max-w-2xl text-[1rem] leading-7 text-[#667085]">
                The reference site uses a warm promotional banner here, so this section now gives your
                client the same conversion-heavy pause between tools and awards.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/search" className="btn-primary">
                  Create now
                </Link>
                <Link href="/search?category=Full+Body" className="btn-outline">
                  View suggested tests
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="surface-card p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fde7ee] text-[#e31b54]">
                  <Plus size={22} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#101e36]">Mix and match tests</h3>
                <p className="mt-2 text-sm leading-7 text-[#667085]">
                  Assemble relevant pathology tests into one custom booking flow.
                </p>
              </div>

              <div className="surface-card p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f7f3] text-[#0b9a8a]">
                  <FlaskConical size={22} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#101e36]">Save on bundled care</h3>
                <p className="mt-2 text-sm leading-7 text-[#667085]">
                  Showcase package savings the same way the reference UI emphasizes value.
                </p>
              </div>

              <div className="surface-card sm:col-span-2 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#7d8798]">Built for conversion</p>
                    <p className="mt-2 text-lg font-bold text-[#101e36]">
                      Add tests first, then route patients to checkout with clearer pricing cues.
                    </p>
                  </div>
                  <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-bold text-[#e31b54]">
                    Go to cart
                    <ChevronRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
