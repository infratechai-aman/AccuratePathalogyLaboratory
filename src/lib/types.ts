// Type definitions for AccurateLabs

export interface Test {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  category: string;
  parameters: string[];
  description: string;
  imageUrl?: string;
  reportTime: number; // hours
  isPackage: boolean;
  includedTests?: string[];
  cities: string[];
  active: boolean;
  testsCount?: number;
  preparations?: string[];
  createdAt?: Date;
}

export interface CartItem {
  test: Test;
  quantity: number;
}

export interface Booking {
  id: string;
  userId: string;
  items: { testId: string; testName: string; price: number }[];
  totalAmount: number;
  status: 'pending' | 'collected' | 'processing' | 'completed';
  patientName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  slotId?: string;
  date: string;
  timeSlot: string;
  paymentId?: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  phlebotomistName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Slot {
  id: string;
  date: string;
  time: string;
  city: string;
  maxBookings: number;
  currentBookings: number;
  available: boolean;
}

export interface Report {
  id: string;
  bookingId: string;
  userId: string;
  testName: string;
  pdfUrl: string;
  uploadedAt: Date;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  familyMembers: FamilyMember[];
  city: string;
  address?: string;
  createdAt: Date;
}

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  relation: string;
}

export const CITIES = [
  'Hadapsar', 'Camp', 'Yerawada', 'Kondhwa'
];

export const TEST_CATEGORIES = [
  'Full Body', 'Heart', 'Vitamin', 'Fever', 'Diabetes',
  'Thyroid', 'Kidney', 'Liver', 'Infection', 'Cancer',
  'Women Health', 'Bone', 'Allergy', 'Immunity'
];

export const BOOKING_STATUSES = [
  { key: 'pending', label: 'Pending', color: '#F59E0B' },
  { key: 'collected', label: 'Sample Collected', color: '#3B82F6' },
  { key: 'processing', label: 'Processing', color: '#8B5CF6' },
  { key: 'completed', label: 'Completed', color: '#22C55E' },
] as const;
