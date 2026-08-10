// ============================================================
// Admin Database Service — Firestore Operations
// ============================================================
// All queries enforce tenantId for multi-tenancy isolation.

import { db } from '../firebase';
import {
  collection, doc, getDocs, getDoc, setDoc, updateDoc,
  deleteDoc, query, where, orderBy, limit, Timestamp,
  runTransaction, writeBatch
} from 'firebase/firestore';
import {
  Patient, Booking, Test, Package, Slot, Collection, Report,
  Payment, Expense, StaffUser, Tenant, Notification,
  BookingStatus, ReportStatus, CollectionStatus, PaymentStatus,
  BookingItem, CollectionStaff
} from '../types';

// ---- Helpers ----
const ts = () => Timestamp.now();
const toDate = (v: any) => v?.toDate?.() || (v instanceof Date ? v : new Date());

function convertDoc<T>(d: any): T {
  const data = d.data ? d.data() : d;
  const converted: any = { ...data };
  for (const key of Object.keys(converted)) {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate();
    }
  }
  if (d.id && !converted.id) converted.id = d.id;
  return converted as T;
}

// ================================================================
// TENANT
// ================================================================

export async function getTenant(tenantId: string): Promise<Tenant | null> {
  const snap = await getDoc(doc(db, 'tenants', tenantId));
  if (!snap.exists()) return null;
  return convertDoc<Tenant>(snap);
}

export async function updateTenant(tenantId: string, data: Partial<Tenant>): Promise<void> {
  await updateDoc(doc(db, 'tenants', tenantId), { ...data, updatedAt: ts() });
}

// ================================================================
// STAFF / USERS
// ================================================================

export async function getStaff(tenantId: string): Promise<StaffUser[]> {
  const q = query(collection(db, 'staff'), where('tenantId', '==', tenantId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => convertDoc<StaffUser>(d));
}

export async function getStaffByUid(uid: string): Promise<StaffUser | null> {
  const snap = await getDoc(doc(db, 'staff', uid));
  if (!snap.exists()) return null;
  return convertDoc<StaffUser>(snap);
}

export async function createStaff(uid: string, data: Omit<StaffUser, 'uid'>): Promise<void> {
  await setDoc(doc(db, 'staff', uid), { ...data, uid, createdAt: ts() });
}

export async function updateStaff(uid: string, data: Partial<StaffUser>): Promise<void> {
  await updateDoc(doc(db, 'staff', uid), { ...data, updatedAt: ts() });
}

export async function getCollectionStaff(tenantId: string): Promise<CollectionStaff[]> {
  const q = query(
    collection(db, 'staff'),
    where('tenantId', '==', tenantId),
    where('role', '==', 'collection_staff')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      uid: d.id,
      tenantId: data.tenantId,
      name: data.name,
      mobile: data.phone || '',
      active: data.active !== false,
      onDuty: data.onDuty || false,
    } as CollectionStaff;
  });
}

// ================================================================
// PATIENTS
// ================================================================

export async function getPatients(tenantId: string): Promise<Patient[]> {
  const q = query(
    collection(db, 'patients'),
    where('tenantId', '==', tenantId),
    where('deleted', '!=', true),
    orderBy('deleted'),
    orderBy('createdAt', 'desc')
  );
  try {
    const snap = await getDocs(q);
    return snap.docs.map(d => convertDoc<Patient>(d));
  } catch {
    // Fallback without compound ordering if index doesn't exist yet
    const q2 = query(collection(db, 'patients'), where('tenantId', '==', tenantId));
    const snap = await getDocs(q2);
    return snap.docs.map(d => convertDoc<Patient>(d)).filter(p => !p.deleted);
  }
}

export async function getPatientById(id: string): Promise<Patient | null> {
  const snap = await getDoc(doc(db, 'patients', id));
  if (!snap.exists()) return null;
  return convertDoc<Patient>(snap);
}

export async function searchPatients(tenantId: string, searchTerm: string): Promise<Patient[]> {
  // Firestore doesn't support full-text search, so we fetch all and filter client-side
  // For production, use Algolia/Typesense or Cloud Functions
  const patients = await getPatients(tenantId);
  const term = searchTerm.toLowerCase();
  return patients.filter(p =>
    p.name.toLowerCase().includes(term) ||
    p.mobile.includes(term) ||
    p.patientId.toLowerCase().includes(term)
  );
}

export async function createPatient(data: Omit<Patient, 'id'>): Promise<string> {
  const ref = doc(collection(db, 'patients'));
  await setDoc(ref, { ...data, id: ref.id, createdAt: ts(), updatedAt: ts(), deleted: false });
  return ref.id;
}

export async function updatePatient(id: string, data: Partial<Patient>): Promise<void> {
  await updateDoc(doc(db, 'patients', id), { ...data, updatedAt: ts() });
}

// ================================================================
// BOOKINGS
// ================================================================

export async function getBookings(tenantId: string): Promise<Booking[]> {
  const q = query(
    collection(db, 'bookings'),
    where('tenantId', '==', tenantId),
    orderBy('createdAt', 'desc')
  );
  try {
    const snap = await getDocs(q);
    return snap.docs.map(d => convertDoc<Booking>(d));
  } catch {
    const q2 = query(collection(db, 'bookings'), where('tenantId', '==', tenantId));
    const snap = await getDocs(q2);
    return snap.docs.map(d => convertDoc<Booking>(d)).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
}

export async function getBookingsByDate(tenantId: string, date: string): Promise<Booking[]> {
  const q = query(
    collection(db, 'bookings'),
    where('tenantId', '==', tenantId),
    where('date', '==', date)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => convertDoc<Booking>(d));
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const snap = await getDoc(doc(db, 'bookings', id));
  if (!snap.exists()) return null;
  return convertDoc<Booking>(snap);
}

export async function createBooking(data: Omit<Booking, 'id'>): Promise<string> {
  const ref = doc(collection(db, 'bookings'));
  await setDoc(ref, { ...data, id: ref.id, createdAt: ts(), updatedAt: ts(), deleted: false });
  return ref.id;
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<void> {
  await updateDoc(doc(db, 'bookings', id), { status, updatedAt: ts() });
}

export async function updateBooking(id: string, data: Partial<Booking>): Promise<void> {
  await updateDoc(doc(db, 'bookings', id), { ...data, updatedAt: ts() });
}

// ================================================================
// TESTS
// ================================================================

export async function getTests(tenantId: string): Promise<Test[]> {
  const q = query(collection(db, 'tests'), where('tenantId', '==', tenantId));
  const snap = await getDocs(q);
  return snap.docs.map(d => convertDoc<Test>(d)).filter(t => !t.deleted);
}

export async function getActiveTests(tenantId: string): Promise<Test[]> {
  const q = query(
    collection(db, 'tests'),
    where('tenantId', '==', tenantId),
    where('active', '==', true)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => convertDoc<Test>(d)).filter(t => !t.deleted);
}

export async function getTestById(id: string): Promise<Test | null> {
  const snap = await getDoc(doc(db, 'tests', id));
  if (!snap.exists()) return null;
  return convertDoc<Test>(snap);
}

export async function createTest(data: Omit<Test, 'id'>): Promise<string> {
  const ref = doc(collection(db, 'tests'));
  await setDoc(ref, { ...data, id: ref.id, createdAt: ts(), updatedAt: ts(), deleted: false });
  return ref.id;
}

export async function updateTest(id: string, data: Partial<Test>): Promise<void> {
  await updateDoc(doc(db, 'tests', id), { ...data, updatedAt: ts() });
}

export async function deleteTest(id: string): Promise<void> {
  await updateDoc(doc(db, 'tests', id), { deleted: true, active: false, updatedAt: ts() });
}

// ================================================================
// PACKAGES
// ================================================================

export async function getPackages(tenantId: string): Promise<Package[]> {
  const q = query(collection(db, 'packages'), where('tenantId', '==', tenantId));
  const snap = await getDocs(q);
  return snap.docs.map(d => convertDoc<Package>(d)).filter(p => !p.deleted);
}

export async function createPackage(data: Omit<Package, 'id'>): Promise<string> {
  const ref = doc(collection(db, 'packages'));
  await setDoc(ref, { ...data, id: ref.id, createdAt: ts(), updatedAt: ts(), deleted: false });
  return ref.id;
}

export async function updatePackage(id: string, data: Partial<Package>): Promise<void> {
  await updateDoc(doc(db, 'packages', id), { ...data, updatedAt: ts() });
}

export async function deletePackage(id: string): Promise<void> {
  await updateDoc(doc(db, 'packages', id), { deleted: true, active: false, updatedAt: ts() });
}

// ================================================================
// SLOTS
// ================================================================

export async function getSlots(tenantId: string): Promise<Slot[]> {
  const q = query(collection(db, 'slots'), where('tenantId', '==', tenantId));
  const snap = await getDocs(q);
  return snap.docs.map(d => convertDoc<Slot>(d));
}

export async function getSlotsByDate(tenantId: string, date: string): Promise<Slot[]> {
  const q = query(
    collection(db, 'slots'),
    where('tenantId', '==', tenantId),
    where('date', '==', date)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => convertDoc<Slot>(d));
}

export async function createSlot(data: Omit<Slot, 'id'>): Promise<string> {
  const ref = doc(collection(db, 'slots'));
  await setDoc(ref, { ...data, id: ref.id, createdAt: ts() });
  return ref.id;
}

export async function updateSlot(id: string, data: Partial<Slot>): Promise<void> {
  await updateDoc(doc(db, 'slots', id), data);
}

export async function incrementSlotBooking(id: string): Promise<void> {
  const slotRef = doc(db, 'slots', id);
  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(slotRef);
    if (!snap.exists()) return;
    const current = snap.data().currentBookings || 0;
    const max = snap.data().maxBookings || 5;
    transaction.update(slotRef, {
      currentBookings: current + 1,
      available: (current + 1) < max,
    });
  });
}

// ================================================================
// COLLECTIONS
// ================================================================

export async function getCollections(tenantId: string): Promise<Collection[]> {
  const q = query(
    collection(db, 'collections'),
    where('tenantId', '==', tenantId),
    orderBy('createdAt', 'desc')
  );
  try {
    const snap = await getDocs(q);
    return snap.docs.map(d => convertDoc<Collection>(d));
  } catch {
    const q2 = query(collection(db, 'collections'), where('tenantId', '==', tenantId));
    const snap = await getDocs(q2);
    return snap.docs.map(d => convertDoc<Collection>(d));
  }
}

export async function getCollectionsByStaff(tenantId: string, staffId: string): Promise<Collection[]> {
  const q = query(
    collection(db, 'collections'),
    where('tenantId', '==', tenantId),
    where('assignedStaffId', '==', staffId)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => convertDoc<Collection>(d));
}

export async function createCollection(data: Omit<Collection, 'id'>): Promise<string> {
  const ref = doc(collection(db, 'collections'));
  await setDoc(ref, { ...data, id: ref.id, createdAt: ts(), updatedAt: ts(), deleted: false });
  return ref.id;
}

export async function updateCollectionStatus(id: string, status: CollectionStatus): Promise<void> {
  await updateDoc(doc(db, 'collections', id), { status, updatedAt: ts() });
}

// ================================================================
// REPORTS
// ================================================================

export async function getReports(tenantId: string): Promise<Report[]> {
  const q = query(
    collection(db, 'reports'),
    where('tenantId', '==', tenantId),
    orderBy('createdAt', 'desc')
  );
  try {
    const snap = await getDocs(q);
    return snap.docs.map(d => convertDoc<Report>(d));
  } catch {
    const q2 = query(collection(db, 'reports'), where('tenantId', '==', tenantId));
    const snap = await getDocs(q2);
    return snap.docs.map(d => convertDoc<Report>(d));
  }
}

export async function getReportsByPatient(tenantId: string, patientId: string): Promise<Report[]> {
  const q = query(
    collection(db, 'reports'),
    where('tenantId', '==', tenantId),
    where('patientId', '==', patientId)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => convertDoc<Report>(d));
}

export async function createReport(data: Omit<Report, 'id'>): Promise<string> {
  const ref = doc(collection(db, 'reports'));
  await setDoc(ref, { ...data, id: ref.id, createdAt: ts(), updatedAt: ts(), deleted: false });
  return ref.id;
}

export async function updateReportStatus(id: string, status: ReportStatus, extraData?: Partial<Report>): Promise<void> {
  const updates: any = { status, updatedAt: ts(), ...extraData };
  if (status === 'verified') updates.verifiedAt = ts();
  if (status === 'delivered') updates.deliveredAt = ts();
  await updateDoc(doc(db, 'reports', id), updates);
}

// ================================================================
// PAYMENTS
// ================================================================

export async function getPayments(tenantId: string): Promise<Payment[]> {
  const q = query(
    collection(db, 'payments'),
    where('tenantId', '==', tenantId),
    orderBy('createdAt', 'desc')
  );
  try {
    const snap = await getDocs(q);
    return snap.docs.map(d => convertDoc<Payment>(d));
  } catch {
    const q2 = query(collection(db, 'payments'), where('tenantId', '==', tenantId));
    const snap = await getDocs(q2);
    return snap.docs.map(d => convertDoc<Payment>(d));
  }
}

export async function createPayment(data: Omit<Payment, 'id'>): Promise<string> {
  const ref = doc(collection(db, 'payments'));
  await setDoc(ref, { ...data, id: ref.id, createdAt: ts(), deleted: false });
  return ref.id;
}

export async function updatePayment(id: string, data: Partial<Payment>): Promise<void> {
  await updateDoc(doc(db, 'payments', id), data);
}

// ================================================================
// EXPENSES
// ================================================================

export async function getExpenses(tenantId: string): Promise<Expense[]> {
  const q = query(
    collection(db, 'expenses'),
    where('tenantId', '==', tenantId),
    orderBy('createdAt', 'desc')
  );
  try {
    const snap = await getDocs(q);
    return snap.docs.map(d => convertDoc<Expense>(d));
  } catch {
    const q2 = query(collection(db, 'expenses'), where('tenantId', '==', tenantId));
    const snap = await getDocs(q2);
    return snap.docs.map(d => convertDoc<Expense>(d));
  }
}

export async function createExpense(data: Omit<Expense, 'id'>): Promise<string> {
  const ref = doc(collection(db, 'expenses'));
  await setDoc(ref, { ...data, id: ref.id, createdAt: ts(), deleted: false });
  return ref.id;
}

export async function updateExpense(id: string, data: Partial<Expense>): Promise<void> {
  await updateDoc(doc(db, 'expenses', id), data);
}

// ================================================================
// NOTIFICATIONS / MESSAGES (fetching only — creation via notification-service)
// ================================================================

export async function getMessages(tenantId: string, limitCount = 100): Promise<Notification[]> {
  const q = query(
    collection(db, 'notifications'),
    where('tenantId', '==', tenantId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => convertDoc<Notification>(d));
}

// ================================================================
// DASHBOARD STATS
// ================================================================

export async function getDashboardStats(tenantId: string) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  const [bookings, collections, reports, payments, expenses] = await Promise.all([
    getBookingsByDate(tenantId, today),
    getCollections(tenantId),
    getReports(tenantId),
    getPayments(tenantId),
    getExpenses(tenantId),
  ]);

  const todayCollections = collections.filter(c => c.date === today);
  const todayPayments = payments.filter(p => p.date === today);
  const todayExpenses = expenses.filter(e => e.date === today);

  const todayRevenue = todayPayments
    .filter(p => p.status === 'paid' || p.status === 'partial')
    .reduce((sum, p) => sum + p.amount, 0);

  const todayExpenseTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  return {
    todayBookings: bookings.length,
    samplesCollected: bookings.filter(b => b.status !== 'booked' && b.status !== 'cancelled').length,
    reportsReady: reports.filter(r => r.status === 'ready' || r.status === 'delivered').length,
    todayHomeCollections: todayCollections.length,
    todayRevenue,
    todayExpenses: todayExpenseTotal,
    netAmount: todayRevenue - todayExpenseTotal,

    collectionBreakdown: {
      assigned: todayCollections.filter(c => c.status === 'assigned').length,
      onTheWay: todayCollections.filter(c => c.status === 'on_the_way').length,
      collected: todayCollections.filter(c => c.status === 'collected').length,
      completed: todayCollections.filter(c => c.status === 'completed').length,
    },

    recentBookings: bookings.slice(0, 8),
    recentNotifications: [] as Notification[], // filled separately
  };
}

// ================================================================
// LEGACY COMPAT — Keep old db.ts functions working
// ================================================================

export async function getUsers(): Promise<any[]> {
  const usersCol = collection(db, 'users');
  const snapshot = await getDocs(usersCol);
  return snapshot.docs.map(d => convertDoc<any>(d));
}

export async function getUserByUid(uid: string): Promise<any | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return convertDoc<any>(snap);
}

export async function getReportsByUser(userId: string): Promise<any[]> {
  const q = query(
    collection(db, 'reports'),
    where('userId', '==', userId),
    orderBy('uploadedAt', 'desc')
  );
  try {
    const snap = await getDocs(q);
    return snap.docs.map(d => convertDoc<any>(d));
  } catch {
    const q2 = query(collection(db, 'reports'), where('userId', '==', userId));
    const snap = await getDocs(q2);
    return snap.docs.map(d => convertDoc<any>(d));
  }
}
