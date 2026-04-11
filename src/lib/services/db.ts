import { db } from '../firebase';
import { 
  collection, doc, getDocs, getDoc, setDoc, updateDoc, 
  deleteDoc, query, where, orderBy, Timestamp 
} from 'firebase/firestore';
import { Test, Booking, User, Slot } from '../types';

// Helper to convert Firestore Timestamps to JS Dates
const convertTimestamp = (data: any) => {
  const converted = { ...data };
  for (const key of Object.keys(converted)) {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate();
    } else if (typeof converted[key] === 'object' && converted[key] !== null) {
      converted[key] = convertTimestamp(converted[key]);
    }
  }
  return converted;
};

// --- TESTS ---
export const getTests = async (): Promise<Test[]> => {
  const testsCol = collection(db, 'tests');
  const snapshot = await getDocs(testsCol);
  return snapshot.docs.map(doc => convertTimestamp({ ...doc.data(), id: doc.id })) as Test[];
};

export const getTestById = async (id: string): Promise<Test | null> => {
  const docRef = doc(db, 'tests', id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return convertTimestamp({ ...docSnap.data(), id: docSnap.id }) as Test;
};

// --- BOOKINGS ---
export const getBookings = async (): Promise<Booking[]> => {
  const bookingsCol = collection(db, 'bookings');
  const q = query(bookingsCol, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => convertTimestamp({ ...doc.data(), id: doc.id })) as Booking[];
};

export const getBookingsByUser = async (userId: string): Promise<Booking[]> => {
  const bookingsCol = collection(db, 'bookings');
  const q = query(bookingsCol, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => convertTimestamp({ ...doc.data(), id: doc.id })) as Booking[];
};

export const createBooking = async (bookingData: Omit<Booking, 'id'>): Promise<string> => {
  const bookingRef = doc(collection(db, 'bookings'));
  await setDoc(bookingRef, {
    ...bookingData,
    id: bookingRef.id,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return bookingRef.id;
};

export const updateBookingStatus = async (id: string, status: string): Promise<void> => {
  const docRef = doc(db, 'bookings', id);
  await updateDoc(docRef, { status, updatedAt: Timestamp.now() });
};

// --- USERS ---
export const getUsers = async (): Promise<User[]> => {
  const usersCol = collection(db, 'users');
  const snapshot = await getDocs(usersCol);
  return snapshot.docs.map(doc => convertTimestamp({ ...doc.data(), uid: doc.id })) as User[];
};

export const getUserByUid = async (uid: string): Promise<User | null> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return convertTimestamp({ ...docSnap.data(), uid: docSnap.id }) as User;
};

export const createUserProfile = async (uid: string, data: Partial<User>): Promise<void> => {
  const docRef = doc(db, 'users', uid);
  await setDoc(docRef, {
    ...data,
    uid,
    createdAt: Timestamp.now()
  });
};

export const updateUserProfile = async (uid: string, data: Partial<User>): Promise<void> => {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, data);
};

// --- REPORTS ---
export const getReportsByUser = async (userId: string): Promise<any[]> => {
  const reportsCol = collection(db, 'reports');
  const q = query(reportsCol, where('userId', '==', userId), orderBy('uploadedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => convertTimestamp({ ...doc.data(), id: doc.id }));
};

// --- SLOTS ---
export const getSlots = async (): Promise<Slot[]> => {
  const slotsCol = collection(db, 'slots');
  const snapshot = await getDocs(slotsCol);
  return snapshot.docs.map(doc => convertTimestamp({ ...doc.data(), id: doc.id })) as Slot[];
};
