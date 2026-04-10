'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ClientLayout from '@/components/layout/ClientLayout';
import TestCard from '@/components/tests/TestCard';
import { sampleTests } from '@/lib/sample-data';
import { useCart } from '@/context/CartContext';
import { Clock, FlaskConical, ShoppingCart, Check, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

function TestDetailContent() {
  const params = useParams();
  const testId = params.id as string;
  const test = sampleTests.find(t => t.id === testId);
  const { addToCart, isInCart, removeFromCart } = useCart();

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-2">Test Not Found</h1>
          <p className="text-text-muted mb-4">The test you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/search" className="btn-primary">Browse All Tests</Link>
        </div>
      </div>
    );
  }

  const inCart = isInCart(test.id);
  const relatedTests = sampleTests.filter(t => t.category === test.category && t.id !== test.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-surface/30">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight size={14} />
            <Link href="/search" className="hover:text-primary">Tests</Link>
            <ChevronRight size={14} />
            <span className="text-primary font-medium">{test.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Test header */}
            <div className="bg-white rounded-2xl border border-border/50 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="badge badge-info mb-2">{test.category}</span>
                  <h1 className="text-2xl font-bold text-brand-red mb-1">{test.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-text-muted">
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-accent" />
                      Reports in {test.reportTime} hours
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FlaskConical size={14} className="text-accent" />
                      {test.testsCount || test.parameters.length} Parameters
                    </span>
                  </div>
                </div>
                {test.isPackage && (
                  <span className="badge bg-accent/10 text-accent font-bold">Package</span>
                )}
              </div>

              <p className="text-text-muted leading-relaxed">{test.description}</p>
            </div>

            {/* Parameters */}
            <div className="bg-white rounded-2xl border border-border/50 p-6">
              <h2 className="text-lg font-bold text-primary mb-4">Parameters Included</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {test.parameters.map((param) => (
                  <div key={param} className="flex items-center gap-2 p-3 rounded-xl bg-surface/50">
                    <CheckCircle size={14} className="text-accent shrink-0" />
                    <span className="text-sm text-primary">{param}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Included tests (for packages) */}
            {test.isPackage && test.includedTests && (
              <div className="bg-white rounded-2xl border border-border/50 p-6">
                <h2 className="text-lg font-bold text-primary mb-4">Tests Included in Package</h2>
                <div className="grid grid-cols-2 gap-2">
                  {test.includedTests.map((t) => (
                    <div key={t} className="flex items-center gap-2 p-3 rounded-xl bg-accent/5 border border-accent/10">
                      <Check size={14} className="text-accent shrink-0" />
                      <span className="text-sm font-medium text-primary">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preparations */}
            {test.preparations && (
              <div className="bg-white rounded-2xl border border-border/50 p-6">
                <h2 className="text-lg font-bold text-primary mb-4">Preparation Required</h2>
                <div className="space-y-2">
                  {test.preparations.map((prep) => (
                    <div key={prep} className="flex items-start gap-2 p-3 rounded-xl bg-warning/5 border border-warning/10">
                      <AlertCircle size={14} className="text-warning shrink-0 mt-0.5" />
                      <span className="text-sm text-primary">{prep}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related tests */}
            {relatedTests.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-primary mb-4">Related Tests</h2>
                <div className="flex gap-4 overflow-x-auto scroll-container pb-4">
                  {relatedTests.map((t) => (
                    <div key={t.id} className="shrink-0">
                      <TestCard test={t} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky sidebar - Price card */}
          <div className="lg:col-span-1">
            <div className="sticky top-[180px] bg-white rounded-2xl border border-border/50 p-6 shadow-sm">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl font-bold text-primary">₹{test.price}</span>
                <span className="text-lg text-text-muted line-through">₹{test.originalPrice}</span>
              </div>
              <div className="flex items-center gap-2 mb-6">
                <span className="badge badge-success text-sm">{test.discount}% Off</span>
                <span className="text-sm text-text-muted">You save ₹{test.originalPrice - test.price}</span>
              </div>

              <button
                onClick={() => inCart ? removeFromCart(test.id) : addToCart(test)}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-semibold transition-all ${
                  inCart
                    ? 'bg-success/10 text-success border-2 border-success/30'
                    : 'btn-primary'
                }`}
              >
                {inCart ? (
                  <><Check size={18} /> Added to Cart</>
                ) : (
                  <><ShoppingCart size={18} /> Add To Cart</>
                )}
              </button>

              {inCart && (
                <Link href="/cart" className="block mt-3 w-full text-center py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-light transition-colors">
                  Go to Cart →
                </Link>
              )}

              <div className="mt-6 space-y-3 pt-6 border-t border-border/50">
                <p className="text-xs text-text-muted">✓ Free home sample collection</p>
                <p className="text-xs text-text-muted">✓ NABL certified labs</p>
                <p className="text-xs text-text-muted">✓ Doctor-verified reports</p>
                <p className="text-xs text-text-muted">✓ Reports in {test.reportTime} hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestDetailPage() {
  return (
    <ClientLayout>
      <TestDetailContent />
    </ClientLayout>
  );
}
