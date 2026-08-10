'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import {
  getActiveTests, getPackages, getSlotsByDate, searchPatients,
  createPatient, createBooking, incrementSlotBooking, createPayment
} from '@/lib/services/admin-db';
import { generateId } from '@/lib/id-generator';
import { logAudit } from '@/lib/services/audit-service';
import { triggerEventNotification } from '@/lib/services/notification-service';
import { Test, Package, Slot, Patient, BookingItem } from '@/lib/types';
import {
  Search, ChevronLeft, ChevronRight, Check, User, FlaskConical,
  MapPin, Calendar, IndianRupee, Plus, X, Loader2, CheckCircle
} from 'lucide-react';

type Step = 1 | 2 | 3 | 4 | 5 | 6;
const STEP_LABELS = ['Patient', 'Tests', 'Type', 'Schedule', 'Payment', 'Confirm'];

export default function NewBookingPage() {
  const router = useRouter();
  const { tenantId, staffUser } = useAdmin();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Step 1: Patient
  const [patientSearch, setPatientSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showNewPatient, setShowNewPatient] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '', mobile: '', email: '', age: '', gender: 'male' as const, address: '',
  });

  // Step 2: Tests
  const [tests, setTests] = useState<Test[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedItems, setSelectedItems] = useState<BookingItem[]>([]);
  const [testSearch, setTestSearch] = useState('');

  // Step 3: Type
  const [collectionType, setCollectionType] = useState<'lab_visit' | 'home_collection'>('lab_visit');
  const [collectionAddress, setCollectionAddress] = useState('');

  // Step 4: Schedule
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  // Step 5: Payment
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending' | 'partial'>('pending');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | 'card' | 'online'>('cash');
  const [partialAmount, setPartialAmount] = useState('');
  const [notes, setNotes] = useState('');

  // Load tests/packages on mount
  useEffect(() => {
    async function load() {
      const [t, p] = await Promise.all([
        getActiveTests(tenantId),
        getPackages(tenantId),
      ]);
      setTests(t);
      setPackages(p.filter(pk => pk.active));
    }
    load();
  }, [tenantId]);

  // Search patients
  useEffect(() => {
    if (patientSearch.length < 2) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      const results = await searchPatients(tenantId, patientSearch);
      setSearchResults(results);
    }, 300);
    return () => clearTimeout(timer);
  }, [patientSearch, tenantId]);

  // Load slots when date changes
  useEffect(() => {
    async function loadSlots() {
      const s = await getSlotsByDate(tenantId, selectedDate);
      setSlots(s.filter(sl => sl.type === collectionType));
    }
    if (selectedDate) loadSlots();
  }, [selectedDate, tenantId, collectionType]);

  const totalAmount = selectedItems.reduce((sum, item) => sum + item.price, 0);

  // Create new patient
  const handleCreatePatient = async () => {
    const patientId = await generateId(tenantId, 'PAT');
    const id = await createPatient({
      tenantId, patientId,
      name: newPatient.name, mobile: newPatient.mobile,
      email: newPatient.email || undefined,
      age: parseInt(newPatient.age) || undefined,
      gender: newPatient.gender,
      address: newPatient.address || undefined,
      totalBookings: 0,
      createdAt: new Date(), updatedAt: new Date(),
    });
    const patient: Patient = {
      id, tenantId, patientId,
      name: newPatient.name, mobile: newPatient.mobile,
      gender: newPatient.gender,
      totalBookings: 0, createdAt: new Date(),
    };
    setSelectedPatient(patient);
    setShowNewPatient(false);
    setStep(2);
  };

  // Toggle test selection
  const toggleTest = (test: Test) => {
    const exists = selectedItems.find(i => i.testId === test.id);
    if (exists) {
      setSelectedItems(selectedItems.filter(i => i.testId !== test.id));
    } else {
      setSelectedItems([...selectedItems, {
        testId: test.id, testName: test.name, price: test.price,
      }]);
    }
  };

  // Toggle package
  const togglePackage = (pkg: Package) => {
    const exists = selectedItems.find(i => i.testId === pkg.id);
    if (exists) {
      setSelectedItems(selectedItems.filter(i => i.testId !== pkg.id));
    } else {
      setSelectedItems([...selectedItems, {
        testId: pkg.id, testName: pkg.name, price: pkg.price, isPackage: true,
      }]);
    }
  };

  // Submit booking
  const handleSubmit = async () => {
    if (!selectedPatient || selectedItems.length === 0) return;
    setSubmitting(true);
    try {
      const bookingId = await generateId(tenantId, 'LAB');

      const firestoreId = await createBooking({
        tenantId, bookingId,
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        patientPhone: selectedPatient.mobile,
        items: selectedItems,
        totalAmount,
        date: selectedDate,
        timeSlot: selectedSlot?.time || '10:00 AM',
        slotId: selectedSlot?.id,
        source: 'staff_created',
        collectionType,
        status: 'booked',
        paymentStatus,
        assignedStaff: staffUser?.uid,
        assignedStaffName: staffUser?.name,
        notes: notes || undefined,
        address: collectionType === 'home_collection' ? collectionAddress : selectedPatient.address,
        city: selectedPatient.city,
        createdBy: staffUser?.uid,
        createdByName: staffUser?.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Record payment if paid
      if (paymentStatus === 'paid' || paymentStatus === 'partial') {
        const paymentId = await generateId(tenantId, 'PAY');
        await createPayment({
          tenantId, paymentId,
          bookingId: firestoreId,
          bookingDisplayId: bookingId,
          patientId: selectedPatient.id,
          patientName: selectedPatient.name,
          amount: paymentStatus === 'partial' ? parseFloat(partialAmount) || 0 : totalAmount,
          method: paymentMethod,
          status: paymentStatus,
          date: selectedDate,
          recordedBy: staffUser?.uid || '',
          recordedByName: staffUser?.name || '',
          createdAt: new Date(),
        });
      }

      // Increment slot
      if (selectedSlot) {
        await incrementSlotBooking(selectedSlot.id);
      }

      // Audit log
      await logAudit(
        tenantId, staffUser?.uid || '', staffUser?.name || '', staffUser?.role || 'super_admin',
        `Created booking ${bookingId}`, 'booking', firestoreId
      );

      // Notification
      await triggerEventNotification(tenantId, selectedPatient.id, selectedPatient.name, 'booking_created', {
        bookingId, labName: 'Lab', date: selectedDate, time: selectedSlot?.time || '10:00 AM',
      });

      setSuccess(bookingId);
    } catch (err) {
      console.error('Booking creation failed:', err);
      alert('Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 16 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%', background: '#D1FAE5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CheckCircle size={32} style={{ color: '#059669' }} />
        </div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>Booking Created!</h2>
        <p style={{ fontSize: '1rem', color: '#64748B' }}>Booking ID: <strong style={{ color: '#0D9488' }}>{success}</strong></p>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button onClick={() => router.push('/admin/bookings')} className="admin-btn admin-btn-secondary">
            View All Bookings
          </button>
          <button onClick={() => { setSuccess(null); setStep(1); setSelectedPatient(null); setSelectedItems([]); }} className="admin-btn admin-btn-primary">
            <Plus size={15} /> Create Another
          </button>
        </div>
      </div>
    );
  }

  const filteredTests = tests.filter(t =>
    !testSearch || t.name.toLowerCase().includes(testSearch.toLowerCase()) ||
    t.category?.toLowerCase().includes(testSearch.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => router.push('/admin/bookings')} className="admin-btn admin-btn-ghost" style={{ padding: 8 }}>
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>New Booking</h1>
          <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 2 }}>Create a new patient booking</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
        {STEP_LABELS.map((label, i) => {
          const stepNum = (i + 1) as Step;
          const isActive = step === stepNum;
          const isDone = step > stepNum;
          return (
            <div key={label} style={{ flex: 1 }}>
              <div style={{
                height: 4, borderRadius: 2, marginBottom: 6,
                background: isDone ? '#0D9488' : isActive ? '#0D9488' : '#E2E8F0',
                opacity: isActive ? 1 : isDone ? 0.6 : 0.3,
              }} />
              <div style={{
                fontSize: '0.68rem', fontWeight: 700,
                color: isActive ? '#0D9488' : isDone ? '#059669' : '#94A3B8',
                textTransform: 'uppercase', letterSpacing: '0.04em',
              }}>
                {i + 1}. {label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Step 1: Patient */}
      {step === 1 && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Select Patient</div>
          </div>
          <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="admin-header-search">
              <Search size={16} style={{ color: '#94A3B8' }} />
              <input
                type="text" value={patientSearch}
                onChange={e => { setPatientSearch(e.target.value); setShowNewPatient(false); }}
                placeholder="Search by mobile number or name..."
              />
            </div>

            {searchResults.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {searchResults.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedPatient(p); setStep(2); }}
                    className="admin-stat-card"
                    style={{
                      cursor: 'pointer', padding: 14, textAlign: 'left',
                      border: selectedPatient?.id === p.id ? '2px solid #0D9488' : undefined,
                      display: 'flex', alignItems: 'center', gap: 12,
                    }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', background: '#CCFBF1',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#0D9488', fontWeight: 700,
                    }}>
                      {p.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#0F172A' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{p.mobile} • {p.patientId}</div>
                    </div>
                    <ChevronRight size={16} style={{ color: '#94A3B8' }} />
                  </button>
                ))}
              </div>
            )}

            {patientSearch.length >= 2 && searchResults.length === 0 && !showNewPatient && (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: 12 }}>No patient found</p>
                <button onClick={() => setShowNewPatient(true)} className="admin-btn admin-btn-primary">
                  <Plus size={15} /> Create New Patient
                </button>
              </div>
            )}

            {showNewPatient && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16, background: '#F8FAFC', borderRadius: 12 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>New Patient</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="admin-label">Full Name *</label>
                    <input className="admin-input" value={newPatient.name}
                      onChange={e => setNewPatient({...newPatient, name: e.target.value})} placeholder="Patient name" />
                  </div>
                  <div>
                    <label className="admin-label">Mobile *</label>
                    <input className="admin-input" value={newPatient.mobile}
                      onChange={e => setNewPatient({...newPatient, mobile: e.target.value})} placeholder="10-digit mobile" />
                  </div>
                  <div>
                    <label className="admin-label">Age</label>
                    <input className="admin-input" type="number" value={newPatient.age}
                      onChange={e => setNewPatient({...newPatient, age: e.target.value})} placeholder="Age" />
                  </div>
                  <div>
                    <label className="admin-label">Gender</label>
                    <select className="admin-select" value={newPatient.gender}
                      onChange={e => setNewPatient({...newPatient, gender: e.target.value as any})}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="admin-label">Address</label>
                  <input className="admin-input" value={newPatient.address}
                    onChange={e => setNewPatient({...newPatient, address: e.target.value})} placeholder="Patient address" />
                </div>
                <button
                  onClick={handleCreatePatient}
                  className="admin-btn admin-btn-primary"
                  disabled={!newPatient.name || !newPatient.mobile}
                >
                  <Check size={15} /> Create & Continue
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Tests */}
      {step === 2 && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Select Tests / Packages</div>
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
              {selectedItems.length} selected • ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="admin-header-search">
              <Search size={16} style={{ color: '#94A3B8' }} />
              <input value={testSearch} onChange={e => setTestSearch(e.target.value)} placeholder="Search tests..." />
            </div>

            {packages.length > 0 && (
              <>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Packages
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {packages.filter(p => !testSearch || p.name.toLowerCase().includes(testSearch.toLowerCase())).map(pkg => {
                    const isSelected = selectedItems.some(i => i.testId === pkg.id);
                    return (
                      <button key={pkg.id} onClick={() => togglePackage(pkg)} className="admin-stat-card" style={{
                        cursor: 'pointer', padding: 14, textAlign: 'left',
                        border: isSelected ? '2px solid #0D9488' : undefined,
                        display: 'flex', alignItems: 'center', gap: 12,
                      }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10, background: isSelected ? '#0D9488' : '#F1F5F9',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: isSelected ? 'white' : '#94A3B8',
                        }}>
                          {isSelected ? <Check size={18} /> : <FlaskConical size={18} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.875rem' }}>{pkg.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{pkg.testNames?.join(', ')}</div>
                        </div>
                        <div style={{ fontWeight: 800, color: '#059669' }}>₹{pkg.price}</div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Individual Tests
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 300, overflowY: 'auto' }}>
              {filteredTests.map(test => {
                const isSelected = selectedItems.some(i => i.testId === test.id);
                return (
                  <button key={test.id} onClick={() => toggleTest(test)} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                    borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                    border: isSelected ? '1px solid #0D9488' : '1px solid #E2E8F0',
                    background: isSelected ? '#F0FDFA' : 'white',
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: 4,
                      border: isSelected ? '2px solid #0D9488' : '2px solid #CBD5E1',
                      background: isSelected ? '#0D9488' : 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {isSelected && <Check size={12} style={{ color: 'white' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.82rem' }}>{test.name}</span>
                      <span style={{ fontSize: '0.68rem', color: '#94A3B8', marginLeft: 8 }}>{test.category}</span>
                    </div>
                    <span style={{ fontWeight: 700, color: '#059669', fontSize: '0.82rem' }}>₹{test.price}</span>
                  </button>
                );
              })}
              {filteredTests.length === 0 && (
                <div className="admin-empty" style={{ padding: 24 }}>
                  <div className="admin-empty-desc">No tests found. Add tests in Tests & Packages.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Collection Type */}
      {step === 3 && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Collection Type</div>
          </div>
          <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { value: 'lab_visit' as const, label: 'Lab Visit', desc: 'Patient visits the lab', icon: '🏥' },
                { value: 'home_collection' as const, label: 'Home Collection', desc: 'Staff visits patient', icon: '🏠' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setCollectionType(opt.value)}
                  className="admin-stat-card"
                  style={{
                    cursor: 'pointer', padding: 24, textAlign: 'center',
                    border: collectionType === opt.value ? '2px solid #0D9488' : undefined,
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>{opt.icon}</div>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>{opt.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 4 }}>{opt.desc}</div>
                </button>
              ))}
            </div>
            {collectionType === 'home_collection' && (
              <div>
                <label className="admin-label">Collection Address *</label>
                <input className="admin-input" value={collectionAddress}
                  onChange={e => setCollectionAddress(e.target.value)}
                  placeholder="Enter patient's address for home collection" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Schedule */}
      {step === 4 && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Select Date & Time</div>
          </div>
          <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="admin-label">Date</label>
              <input type="date" className="admin-input" value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]} />
            </div>

            <div>
              <label className="admin-label">Available Slots</label>
              {slots.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
                  {slots.map(slot => {
                    const isFull = slot.currentBookings >= slot.maxBookings;
                    const isSelected = selectedSlot?.id === slot.id;
                    return (
                      <button
                        key={slot.id}
                        onClick={() => !isFull && setSelectedSlot(slot)}
                        disabled={isFull}
                        style={{
                          padding: '10px 14px', borderRadius: 10, textAlign: 'center',
                          cursor: isFull ? 'not-allowed' : 'pointer',
                          border: isSelected ? '2px solid #0D9488' : '1px solid #E2E8F0',
                          background: isFull ? '#F1F5F9' : isSelected ? '#F0FDFA' : 'white',
                          opacity: isFull ? 0.5 : 1,
                        }}
                      >
                        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.875rem' }}>{slot.time}</div>
                        <div style={{ fontSize: '0.68rem', color: isFull ? '#DC2626' : '#64748B' }}>
                          {isFull ? 'Full' : `${slot.maxBookings - slot.currentBookings} available`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div style={{ background: '#F8FAFC', borderRadius: 12, padding: 24, textAlign: 'center' }}>
                  <p style={{ color: '#64748B', fontSize: '0.82rem', marginBottom: 8 }}>No slots configured for this date</p>
                  <p style={{ color: '#94A3B8', fontSize: '0.72rem' }}>You can still create the booking. Set time manually below.</p>
                  <input type="time" className="admin-input" style={{ maxWidth: 200, margin: '12px auto 0' }}
                    onChange={e => setSelectedSlot({ id: '', tenantId, date: selectedDate, time: e.target.value, type: collectionType, maxBookings: 5, currentBookings: 0, available: true })} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Payment */}
      {step === 5 && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Payment</div>
            <span style={{ fontWeight: 800, color: '#059669', fontSize: '1.1rem' }}>₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {(['paid', 'pending', 'partial'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setPaymentStatus(status)}
                  className="admin-stat-card"
                  style={{
                    cursor: 'pointer', padding: 16, textAlign: 'center',
                    border: paymentStatus === status ? '2px solid #0D9488' : undefined,
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#0F172A', textTransform: 'capitalize' }}>{status}</div>
                </button>
              ))}
            </div>

            {paymentStatus !== 'pending' && (
              <div>
                <label className="admin-label">Payment Method</label>
                <select className="admin-select" value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value as any)}>
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                  <option value="online">Online Payment</option>
                </select>
              </div>
            )}

            {paymentStatus === 'partial' && (
              <div>
                <label className="admin-label">Amount Paid</label>
                <input type="number" className="admin-input" value={partialAmount}
                  onChange={e => setPartialAmount(e.target.value)}
                  placeholder="Enter amount paid" />
              </div>
            )}

            <div>
              <label className="admin-label">Notes (optional)</label>
              <input className="admin-input" value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any notes for this booking..." />
            </div>
          </div>
        </div>
      )}

      {/* Step 6: Confirm */}
      {step === 6 && (
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">Confirm Booking</div>
          </div>
          <div className="admin-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SummaryRow label="Patient" value={selectedPatient?.name || ''} />
            <SummaryRow label="Mobile" value={selectedPatient?.mobile || ''} />
            <SummaryRow label="Tests" value={selectedItems.map(i => i.testName).join(', ')} />
            <SummaryRow label="Type" value={collectionType === 'lab_visit' ? 'Lab Visit' : 'Home Collection'} />
            <SummaryRow label="Date" value={selectedDate} />
            <SummaryRow label="Time" value={selectedSlot?.time || 'Not set'} />
            <SummaryRow label="Amount" value={`₹${totalAmount.toLocaleString('en-IN')}`} bold />
            <SummaryRow label="Payment" value={paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)} />
            {notes && <SummaryRow label="Notes" value={notes} />}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, gap: 12 }}>
        {step > 1 ? (
          <button onClick={() => setStep((step - 1) as Step)} className="admin-btn admin-btn-secondary">
            <ChevronLeft size={15} /> Back
          </button>
        ) : <div />}

        {step < 6 ? (
          <button
            onClick={() => setStep((step + 1) as Step)}
            className="admin-btn admin-btn-primary"
            disabled={
              (step === 1 && !selectedPatient) ||
              (step === 2 && selectedItems.length === 0) ||
              (step === 3 && collectionType === 'home_collection' && !collectionAddress)
            }
          >
            Next <ChevronRight size={15} />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting} className="admin-btn admin-btn-primary">
            {submitting ? (
              <><Loader2 size={15} style={{ animation: 'admin-spin 0.7s linear infinite' }} /> Creating...</>
            ) : (
              <><Check size={15} /> Confirm Booking</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
      <span style={{ fontSize: '0.82rem', color: '#64748B' }}>{label}</span>
      <span style={{ fontSize: '0.82rem', fontWeight: bold ? 800 : 600, color: bold ? '#059669' : '#0F172A' }}>{value}</span>
    </div>
  );
}
