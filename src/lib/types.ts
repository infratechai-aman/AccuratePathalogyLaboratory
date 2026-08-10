// ============================================================
// InfraTechAI Pathology Lab Management — Type Definitions
// ============================================================

// ---- Roles & Permissions ----

export type StaffRole = 'super_admin' | 'receptionist' | 'lab_technician' | 'collection_staff';

export interface StaffUser {
  uid: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  permissions: string[];
  active: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

// ---- Tenant / Lab ----

export interface Tenant {
  id: string;
  labName: string;
  logo?: string;
  tagline?: string;
  phone: string;
  email: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstNumber?: string;
  licenseNumber?: string;
  websiteUrl?: string;
  googleMapsUrl?: string;
  workingDays: string[]; // ['Mon','Tue',...]
  openingTime: string;   // '09:00'
  closingTime: string;   // '18:00'
  brandColors: {
    primary: string;
    secondary: string;
  };
  website?: {
    about?: string;
    services?: string[];
    socialLinks?: Record<string, string>;
    homeCollectionAvailable?: boolean;
  };
  subscription: {
    plan: 'monthly' | 'yearly';
    price: number;
    mobileApp: boolean;
    expiresAt: Date;
  };
  reportSettings?: {
    headerText?: string;
    labInfo?: string;
    authorizedSignatory?: string;
    footer?: string;
  };
  paymentSettings?: {
    methods: string[];
    upiId?: string;
    onlineEnabled: boolean;
  };
  notificationSettings?: {
    whatsappEnabled: boolean;
    whatsappApiKey?: string;
    emailEnabled: boolean;
    emailFrom?: string;
  };
  createdAt: Date;
  updatedAt?: Date;
}

// ---- Patient ----

export interface Patient {
  id: string;          // Firestore doc ID
  tenantId: string;
  patientId: string;   // PAT-000245
  name: string;
  mobile: string;
  email?: string;
  dob?: string;
  age?: number;
  gender: 'male' | 'female' | 'other';
  address?: string;
  city?: string;
  notes?: string;
  totalBookings: number;
  lastVisit?: Date;
  createdAt: Date;
  updatedAt?: Date;
  deleted?: boolean;
}

// ---- Tests & Packages ----

export interface Test {
  id: string;
  tenantId?: string;
  testCode?: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  description?: string;
  sampleType?: string;
  preparations?: string[];
  turnaroundTime?: string;   // e.g., '24 hours'
  parameters?: string[];
  active: boolean;
  cities?: string[];
  imageUrl?: string;
  isPackage?: boolean;
  testsCount?: number;
  reportTime?: number;
  includedTests?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
}

export interface Package {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  testIds: string[];
  testNames: string[];
  price: number;
  originalPrice?: number;
  discount?: number;
  category?: string;
  active: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deleted?: boolean;
}

// ---- Booking ----

export type BookingStatus =
  | 'booked'
  | 'sample_collected'
  | 'processing'
  | 'report_ready'
  | 'delivered'
  | 'cancelled';

export type BookingSource = 'online' | 'walk_in' | 'phone' | 'staff_created';
export type CollectionType = 'lab_visit' | 'home_collection';
export type PaymentStatus = 'paid' | 'pending' | 'partial' | 'refunded';

export interface BookingItem {
  testId: string;
  testName: string;
  price: number;
  isPackage?: boolean;
}

export interface Booking {
  id: string;            // Firestore doc ID
  tenantId: string;
  bookingId: string;     // LAB-10245
  patientId: string;
  patientName: string;
  patientPhone: string;
  items: BookingItem[];
  totalAmount: number;
  date: string;
  timeSlot: string;
  slotId?: string;
  source: BookingSource;
  collectionType: CollectionType;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  assignedStaff?: string;
  assignedStaffName?: string;
  notes?: string;
  address?: string;
  city?: string;
  phone?: string;
  userId?: string;
  phlebotomistName?: string;
  paymentId?: string;
  createdBy?: string;
  createdByName?: string;
  createdAt: Date;
  updatedAt: Date;
  deleted?: boolean;
}

// ---- Slot ----

export type SlotType = 'lab_visit' | 'home_collection';

export interface Slot {
  id: string;
  tenantId: string;
  date: string;
  time: string;
  endTime?: string;
  type: SlotType;
  maxBookings: number;
  currentBookings: number;
  available: boolean;
  duration?: number;   // minutes
  createdAt?: Date;
}

// ---- Collection (Home Collection) ----

export type CollectionStatus = 'assigned' | 'on_the_way' | 'collected' | 'completed' | 'cancelled';

export interface Collection {
  id: string;
  tenantId: string;
  collectionId: string;  // COL-00456
  bookingId: string;
  bookingDisplayId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  address: string;
  date: string;
  time: string;
  assignedStaffId: string;
  assignedStaffName: string;
  testName: string;
  status: CollectionStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  deleted?: boolean;
}

export interface CollectionStaff {
  uid: string;
  tenantId: string;
  name: string;
  mobile: string;
  active: boolean;
  onDuty?: boolean;
  totalCollections?: number;
}

// ---- Report ----

export type ReportStatus = 'pending' | 'processing' | 'uploaded' | 'verified' | 'ready' | 'delivered';

export interface Report {
  id: string;
  tenantId: string;
  reportId: string;      // RPT-00123
  bookingId: string;
  bookingDisplayId: string;
  patientId: string;
  patientName: string;
  testName: string;
  pdfUrl: string;
  status: ReportStatus;
  uploadedBy?: string;
  uploadedByName?: string;
  verifiedBy?: string;
  verifiedByName?: string;
  secureAccessToken?: string;
  uploadedAt?: Date;
  verifiedAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deleted?: boolean;
}

// ---- Payment ----

export type PaymentMethod = 'cash' | 'upi' | 'card' | 'online';

export interface Payment {
  id: string;
  tenantId: string;
  paymentId: string;     // PAY-00789
  bookingId: string;
  bookingDisplayId: string;
  patientId: string;
  patientName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  notes?: string;
  recordedBy: string;
  recordedByName: string;
  date: string;
  createdAt: Date;
  deleted?: boolean;
}

// ---- Expense ----

export type ExpenseCategory =
  | 'electricity'
  | 'rent'
  | 'supplies'
  | 'transportation'
  | 'maintenance'
  | 'salary'
  | 'equipment'
  | 'other';

export interface Expense {
  id: string;
  tenantId: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  date: string;
  addedBy: string;
  addedByName: string;
  createdAt: Date;
  deleted?: boolean;
}

// ---- Notification / Message ----

export type NotificationType = 'whatsapp' | 'email' | 'system';
export type NotificationEvent =
  | 'booking_created'
  | 'payment_received'
  | 'sample_collected'
  | 'collection_assigned'
  | 'report_uploaded'
  | 'report_verified'
  | 'report_ready'
  | 'report_delivered';

export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'failed';

export interface Notification {
  id: string;
  tenantId: string;
  patientId: string;
  patientName: string;
  type: NotificationType;
  event: NotificationEvent;
  message: string;
  status: MessageStatus;
  sentAt?: Date;
  createdAt: Date;
}

// ---- Audit Log ----

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  userRole: StaffRole;
  action: string;
  recordType: string;
  recordId?: string;
  details?: string;
  timestamp: Date;
}

// ---- Status Config Helpers ----

export const BOOKING_STATUSES: { key: BookingStatus; label: string; color: string }[] = [
  { key: 'booked',           label: 'Booked',            color: '#0D9488' },
  { key: 'sample_collected', label: 'Sample Collected',  color: '#2563EB' },
  { key: 'processing',       label: 'Processing',        color: '#D97706' },
  { key: 'report_ready',     label: 'Report Ready',      color: '#059669' },
  { key: 'delivered',        label: 'Delivered',          color: '#16A34A' },
  { key: 'cancelled',        label: 'Cancelled',         color: '#DC2626' },
];

export const REPORT_STATUSES: { key: ReportStatus; label: string; color: string }[] = [
  { key: 'pending',    label: 'Pending',     color: '#D97706' },
  { key: 'processing', label: 'Processing',  color: '#2563EB' },
  { key: 'uploaded',   label: 'Uploaded',     color: '#7C3AED' },
  { key: 'verified',   label: 'Verified',     color: '#0D9488' },
  { key: 'ready',      label: 'Ready',        color: '#059669' },
  { key: 'delivered',  label: 'Delivered',    color: '#16A34A' },
];

export const COLLECTION_STATUSES: { key: CollectionStatus; label: string; color: string }[] = [
  { key: 'assigned',   label: 'Assigned',     color: '#2563EB' },
  { key: 'on_the_way', label: 'On the Way',   color: '#D97706' },
  { key: 'collected',  label: 'Collected',     color: '#7C3AED' },
  { key: 'completed',  label: 'Completed',     color: '#059669' },
  { key: 'cancelled',  label: 'Cancelled',     color: '#DC2626' },
];

export const PAYMENT_STATUSES: { key: PaymentStatus; label: string; color: string }[] = [
  { key: 'paid',     label: 'Paid',      color: '#059669' },
  { key: 'pending',  label: 'Pending',   color: '#D97706' },
  { key: 'partial',  label: 'Partial',   color: '#2563EB' },
  { key: 'refunded', label: 'Refunded',  color: '#DC2626' },
];

export const TEST_CATEGORIES = [
  'Full Body', 'Heart', 'Vitamin', 'Fever', 'Diabetes',
  'Thyroid', 'Kidney', 'Liver', 'Infection', 'Cancer',
  'Women Health', 'Bone', 'Allergy', 'Immunity', 'Routine',
];

export const EXPENSE_CATEGORIES: { key: ExpenseCategory; label: string }[] = [
  { key: 'electricity',    label: 'Electricity' },
  { key: 'rent',           label: 'Rent' },
  { key: 'supplies',       label: 'Supplies' },
  { key: 'transportation', label: 'Transportation' },
  { key: 'maintenance',    label: 'Maintenance' },
  { key: 'salary',         label: 'Salary' },
  { key: 'equipment',      label: 'Equipment' },
  { key: 'other',          label: 'Other' },
];

export const CITIES = [
  'Hadapsar', 'Camp', 'Yerawada', 'Kondhwa',
];

// Legacy compat — kept for patient-side pages
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

export interface CartItem {
  test: Test;
  quantity: number;
}
