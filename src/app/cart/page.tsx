'use client';

import React from 'react';
import Link from 'next/link';
import ClientLayout from '@/components/layout/ClientLayout';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight, Tag } from 'lucide-react';

function CartContent() {
  const { state, removeFromCart, updateQuantity } = useCart();

  return (
    <div className="min-h-screen bg-surface/30">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/search" className="p-2 rounded-lg hover:bg-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-primary">Your Cart</h1>
          <span className="badge badge-info">{state.totalItems} item{state.totalItems !== 1 ? 's' : ''}</span>
        </div>

        {state.items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border/50 p-12 text-center">
            <ShoppingBag size={64} className="mx-auto text-text-muted/30 mb-4" />
            <h2 className="text-xl font-bold text-primary mb-2">Your cart is empty</h2>
            <p className="text-text-muted mb-6">Browse our tests and packages to get started</p>
            <Link href="/search" className="btn-primary py-3 px-8 rounded-xl">
              Browse Tests
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-3">
              {state.items.map((item) => (
                <div key={item.test.id} className="bg-white rounded-2xl border border-border/50 p-5 card-hover">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link href={`/tests/${item.test.id}`} className="text-base font-bold text-brand-red hover:underline">
                        {item.test.name}
                      </Link>
                      <p className="text-xs text-text-muted mt-0.5">{item.test.category} • {item.test.testsCount || item.test.parameters.length} parameters</p>

                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center border border-border rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.test.id, item.quantity - 1)}
                            className="px-2.5 py-1.5 hover:bg-surface transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 py-1.5 text-sm font-semibold border-x border-border">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.test.id, item.quantity + 1)}
                            className="px-2.5 py-1.5 hover:bg-surface transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.test.id)}
                          className="p-2 text-error/60 hover:text-error hover:bg-error/5 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">₹{item.test.price * item.quantity}</p>
                      <p className="text-sm text-text-muted line-through">₹{item.test.originalPrice * item.quantity}</p>
                      <span className="badge badge-success mt-1">{item.test.discount}% Off</span>
                    </div>
                  </div>
                </div>
              ))}

              <Link href="/search" className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-light transition-colors mt-2">
                <ArrowLeft size={14} /> Add More Tests
              </Link>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-[180px] bg-white rounded-2xl border border-border/50 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-primary mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Subtotal ({state.totalItems} items)</span>
                    <span className="font-medium">₹{state.totalPrice + state.totalDiscount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted flex items-center gap-1">
                      <Tag size={12} className="text-success" /> Discount
                    </span>
                    <span className="font-medium text-success">-₹{state.totalDiscount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Home Collection</span>
                    <span className="font-medium text-success">FREE</span>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-3 mb-6">
                  <div className="flex justify-between">
                    <span className="font-bold text-primary">To Pay</span>
                    <span className="text-xl font-bold text-primary">₹{state.totalPrice}</span>
                  </div>
                  <p className="text-xs text-success mt-1 font-medium">
                    You save ₹{state.totalDiscount} on this order!
                  </p>
                </div>

                <Link
                  href="/checkout"
                  className="btn-primary w-full justify-center py-3.5 rounded-xl text-base"
                >
                  Continue to Checkout <ArrowRight size={18} />
                </Link>

                <div className="mt-4 text-xs text-text-muted space-y-1">
                  <p>✓ Free home sample collection</p>
                  <p>✓ 100% secure payment</p>
                  <p>✓ Easy cancellation</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <ClientLayout>
      <CartContent />
    </ClientLayout>
  );
}
