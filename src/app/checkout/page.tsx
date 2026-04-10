'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientLayout from '@/components/layout/ClientLayout';
import { useCart } from '@/context/CartContext';
import { useCity } from '@/context/CityContext';
import { sampleSlots } from '@/lib/sample-data';
import {
  User, Phone, Mail, MapPin, Calendar, Clock, CreditCard,
  ArrowLeft, ArrowRight, Check, Shield, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

type Step = 'details' | 'slot' | 'payment';

function CheckoutContent() {
  const router = useRouter();
  const { state, clearCart } = useCart();
  const { selectedCity } = useCity();
  const [currentStep, setCurrentStep] = useState<Step>('details');
  const [processing, setProcessing] = useState(false);

  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '',
    date: '', slotId: '', timeSlot: '',
  });

  const availableDates = [...new Set(sampleSlots.filter(s => s.city === selectedCity || !selectedCity).map(s => s.date))];
  const availableSlots = sampleSlots.filter(s =>
    s.date === form.date && (s.city === selectedCity || !selectedCity) && s.available
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const selectSlot = (slot: typeof sampleSlots[0]) => {
    setForm({ ...form, slotId: slot.id, timeSlot: slot.time });
  };

  const handlePayment = async () => {
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const bookingId = 'BK' + Date.now().toString().slice(-6);
    clearCart();
    router.push(`/booking/confirmation/${bookingId}?name=${encodeURIComponent(form.name)}&total=${state.totalPrice}`);
  };

  const steps = [
    { key: 'details', label: 'Patient Details', icon: User },
    { key: 'slot', label: 'Select Slot', icon: Calendar },
    { key: 'payment', label: 'Payment', icon: CreditCard },
  ] as const;

  const canProceedToSlot = form.name && form.phone && form.address;
  const canProceedToPayment = form.date && form.slotId;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface/30">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-2">No items in cart</h1>
          <p className="text-text-muted mb-4">Add tests to your cart before checkout</p>
          <Link href="/search" className="btn-primary">Browse Tests</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface/30">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((step, i) => (
            <React.Fragment key={step.key}>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                currentStep === step.key
                  ? 'bg-primary text-white shadow-md'
                  : steps.findIndex(s => s.key === currentStep) > i
                  ? 'bg-success/10 text-success'
                  : 'bg-white text-text-muted border border-border'
              }`}>
                {steps.findIndex(s => s.key === currentStep) > i ? (
                  <Check size={14} />
                ) : (
                  <step.icon size={14} />
                )}
                <span className="hidden sm:inline">{step.label}</span>
              </div>
              {i < steps.length - 1 && <ChevronRight size={16} className="text-text-muted" />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="lg:col-span-2">
            {/* Patient Details */}
            {currentStep === 'details' && (
              <div className="bg-white rounded-2xl border border-border/50 p-6 animate-fade-in-up">
                <h2 className="text-xl font-bold text-primary mb-6">Patient Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-1.5">Full Name *</label>
                    <div className="flex items-center border border-border rounded-xl focus-within:border-accent transition-colors">
                      <User size={16} className="ml-4 text-text-muted" />
                      <input type="text" name="name" value={form.name} onChange={handleChange}
                        placeholder="Enter patient name"
                        className="w-full px-3 py-3 bg-transparent outline-none text-sm" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-1.5">Phone Number *</label>
                      <div className="flex items-center border border-border rounded-xl focus-within:border-accent">
                        <Phone size={16} className="ml-4 text-text-muted" />
                        <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                          placeholder="10-digit number"
                          className="w-full px-3 py-3 bg-transparent outline-none text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-1.5">Email (Optional)</label>
                      <div className="flex items-center border border-border rounded-xl focus-within:border-accent">
                        <Mail size={16} className="ml-4 text-text-muted" />
                        <input type="email" name="email" value={form.email} onChange={handleChange}
                          placeholder="email@example.com"
                          className="w-full px-3 py-3 bg-transparent outline-none text-sm" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-1.5">Collection Address *</label>
                    <div className="flex items-start border border-border rounded-xl focus-within:border-accent">
                      <MapPin size={16} className="ml-4 mt-3 text-text-muted" />
                      <textarea name="address" value={form.address} onChange={handleChange}
                        placeholder="Enter complete address for home sample collection" rows={3}
                        className="w-full px-3 py-3 bg-transparent outline-none text-sm resize-none" />
                    </div>
                  </div>
                  <button onClick={() => setCurrentStep('slot')} disabled={!canProceedToSlot}
                    className="btn-primary w-full justify-center py-3 rounded-xl text-base disabled:opacity-50 disabled:cursor-not-allowed">
                    Continue to Select Slot <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Slot Selection */}
            {currentStep === 'slot' && (
              <div className="bg-white rounded-2xl border border-border/50 p-6 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => setCurrentStep('details')} className="p-2 rounded-lg hover:bg-surface">
                    <ArrowLeft size={18} />
                  </button>
                  <h2 className="text-xl font-bold text-primary">Select Date & Time</h2>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-primary mb-3">Choose Date</label>
                  <div className="flex gap-2 overflow-x-auto scroll-container pb-2">
                    {availableDates.map((date) => {
                      const d = new Date(date);
                      return (
                        <button key={date}
                          onClick={() => setForm({ ...form, date, slotId: '', timeSlot: '' })}
                          className={`shrink-0 w-20 p-3 rounded-xl text-center border-2 transition-all ${
                            form.date === date ? 'border-accent bg-accent/5 text-accent' : 'border-border hover:border-accent/50 text-primary'
                          }`}>
                          <p className="text-xs font-medium text-text-muted">{d.toLocaleDateString('en-IN', { weekday: 'short' })}</p>
                          <p className="text-lg font-bold">{d.getDate()}</p>
                          <p className="text-xs">{d.toLocaleDateString('en-IN', { month: 'short' })}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {form.date && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-primary mb-3">Choose Time Slot</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {availableSlots.map((slot) => (
                        <button key={slot.id} onClick={() => selectSlot(slot)}
                          disabled={!slot.available || slot.currentBookings >= slot.maxBookings}
                          className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            form.slotId === slot.id ? 'border-accent bg-accent/5 text-accent'
                            : slot.currentBookings >= slot.maxBookings ? 'border-border bg-surface text-text-muted/50 cursor-not-allowed'
                            : 'border-border hover:border-accent/50 text-primary'
                          }`}>
                          <Clock size={14} className="inline mr-1.5" />{slot.time}
                          {slot.currentBookings >= slot.maxBookings && <p className="text-xs text-error mt-1">Fully booked</p>}
                        </button>
                      ))}
                      {availableSlots.length === 0 && (
                        <p className="col-span-full text-center text-text-muted text-sm py-4">
                          No slots available for this date in {selectedCity}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <button onClick={() => setCurrentStep('payment')} disabled={!canProceedToPayment}
                  className="btn-primary w-full justify-center py-3 rounded-xl text-base disabled:opacity-50 disabled:cursor-not-allowed">
                  Continue to Payment <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* Payment */}
            {currentStep === 'payment' && (
              <div className="bg-white rounded-2xl border border-border/50 p-6 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => setCurrentStep('slot')} className="p-2 rounded-lg hover:bg-surface">
                    <ArrowLeft size={18} />
                  </button>
                  <h2 className="text-xl font-bold text-primary">Payment</h2>
                </div>

                <div className="bg-surface/50 rounded-xl p-4 mb-6 space-y-2">
                  <p className="text-sm"><strong>Patient:</strong> {form.name}</p>
                  <p className="text-sm"><strong>Phone:</strong> {form.phone}</p>
                  <p className="text-sm"><strong>Address:</strong> {form.address}</p>
                  <p className="text-sm"><strong>Date:</strong> {form.date} | <strong>Time:</strong> {form.timeSlot}</p>
                  <p className="text-sm"><strong>City:</strong> {selectedCity}</p>
                </div>

                <div className="border-2 border-dashed border-accent/30 rounded-xl p-6 text-center mb-6 bg-accent/5">
                  <Shield size={32} className="mx-auto text-accent mb-3" />
                  <h3 className="text-lg font-bold text-primary mb-1">Secure Payment</h3>
                  <p className="text-sm text-text-muted mb-4">Payment powered by Razorpay (Mock Mode)</p>
                  <div className="flex items-center justify-center gap-3 mb-4 text-xs text-text-muted">
                    <span className="px-3 py-1.5 bg-white rounded-lg border">💳 Cards</span>
                    <span className="px-3 py-1.5 bg-white rounded-lg border">🏦 UPI</span>
                    <span className="px-3 py-1.5 bg-white rounded-lg border">📱 Wallets</span>
                    <span className="px-3 py-1.5 bg-white rounded-lg border">🏧 Net Banking</span>
                  </div>
                </div>

                <button onClick={handlePayment} disabled={processing}
                  className="btn-primary w-full justify-center py-4 rounded-xl text-lg disabled:opacity-70">
                  {processing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Payment...
                    </span>
                  ) : (
                    <>Pay ₹{state.totalPrice}</>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-[180px] bg-white rounded-2xl border border-border/50 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-primary mb-3">Order Summary</h3>
              <div className="space-y-2 mb-4">
                {state.items.map((item) => (
                  <div key={item.test.id} className="flex justify-between text-sm">
                    <span className="text-text-muted line-clamp-1 flex-1 mr-2">{item.test.name}</span>
                    <span className="font-medium shrink-0">₹{item.test.price}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border/50 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Discount</span>
                  <span className="text-success font-medium">-₹{state.totalDiscount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Collection</span>
                  <span className="text-success font-medium">FREE</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border/50">
                  <span className="font-bold text-primary">Total</span>
                  <span className="text-lg font-bold text-primary">₹{state.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <ClientLayout>
      <CheckoutContent />
    </ClientLayout>
  );
}
