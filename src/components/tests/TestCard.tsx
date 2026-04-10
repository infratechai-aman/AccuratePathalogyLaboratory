'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Test } from '@/lib/types';
import { Check, ChevronRight, ShoppingCart } from 'lucide-react';

interface TestCardProps {
  test: Test;
  compact?: boolean;
}

export default function TestCard({ test }: TestCardProps) {
  const { state, addToCart, removeFromCart } = useCart();
  const isInCart = state.items.some((item) => item.test.id === test.id);
  const visibleParams = test.parameters.slice(0, 5);
  const remainingParams = Math.max(test.parameters.length - visibleParams.length, 0);

  return (
    <article className="test-card">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-full bg-[#fde7ee] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#e31b54]">
          {test.isPackage ? 'Package' : 'Test'}
        </div>
        <div className="rounded-full bg-[#e8f7f3] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#0b9a8a]">
          {test.discount}% off
        </div>
      </div>

      <div>
        <h3 className="test-card__title">{test.name}</h3>
        <Link href={`/tests/${test.id}`} className="test-card__link mt-2">
          View details
          <ChevronRight size={15} />
        </Link>
      </div>

      <div className="test-card__meta">
        <span className="test-card__meta-badge">Reports in {test.reportTime} hours</span>
        <span>{test.testsCount || test.parameters.length} parameters</span>
        <span>Home sample collection available</span>
      </div>

      <div className="test-card__params">
        {visibleParams.map((param) => (
          <span key={param} className="param-tag">
            <span className="text-[#0b9a8a]">+</span>
            {param}
          </span>
        ))}
        {remainingParams > 0 && <span className="param-tag">+{remainingParams} more</span>}
      </div>

      <div className="test-card__bottom">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="test-card__price">{`\u20B9${test.price}`}</span>
            {typeof test.originalPrice === 'number' && (
              <span className="test-card__og-price">{`\u20B9${test.originalPrice}`}</span>
            )}
            <span className="test-card__discount">Save {test.discount}%</span>
          </div>
          <p className="test-card__vip mt-2">Extra member savings available on bundled bookings.</p>
        </div>

        {isInCart ? (
          <button
            onClick={() => removeFromCart(test.id)}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0b9a8a] bg-[#e8f7f3] px-5 py-3 text-sm font-bold text-[#0b9a8a] transition hover:bg-[#daf3ed]"
          >
            <Check size={16} />
            Added
          </button>
        ) : (
          <button
            onClick={() => addToCart(test)}
            className="btn-primary shrink-0 px-5 py-3 text-sm"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        )}
      </div>
    </article>
  );
}
