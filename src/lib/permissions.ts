// ============================================================
// Role-Based Permission System
// ============================================================

import { StaffRole } from './types';

// All possible permissions in the system
export const ALL_PERMISSIONS = {
  // Dashboard
  'dashboard.view': 'View Dashboard',

  // Bookings
  'bookings.view': 'View All Bookings',
  'bookings.view_assigned': 'View Assigned Bookings',
  'bookings.create': 'Create Bookings',
  'bookings.update_status': 'Update Booking Status',
  'bookings.cancel': 'Cancel Bookings',
  'bookings.export': 'Export Bookings',

  // Patients
  'patients.view': 'View Patients',
  'patients.create': 'Create Patients',
  'patients.edit': 'Edit Patients',
  'patients.delete': 'Delete Patients',

  // Reports
  'reports.view': 'View Reports',
  'reports.upload': 'Upload Reports',
  'reports.verify': 'Verify Reports',
  'reports.mark_ready': 'Mark Reports Ready',
  'reports.download': 'Download Reports',
  'reports.delete': 'Delete Reports',

  // Collections
  'collections.view': 'View All Collections',
  'collections.view_assigned': 'View Assigned Collections',
  'collections.assign': 'Assign Collections',
  'collections.update_status': 'Update Collection Status',
  'collections.manage_staff': 'Manage Collection Staff',

  // Tests & Packages
  'tests.view': 'View Tests',
  'tests.create': 'Create Tests',
  'tests.edit': 'Edit Tests',
  'tests.delete': 'Delete Tests',
  'packages.view': 'View Packages',
  'packages.create': 'Create Packages',
  'packages.edit': 'Edit Packages',
  'packages.delete': 'Delete Packages',

  // Slots
  'slots.view': 'View Slots',
  'slots.manage': 'Manage Slots',

  // Payments
  'payments.view': 'View Payments',
  'payments.record': 'Record Payments',
  'payments.edit': 'Edit Payments',
  'payments.refund': 'Process Refunds',

  // Expenses
  'expenses.view': 'View Expenses',
  'expenses.create': 'Create Expenses',
  'expenses.edit': 'Edit Expenses',
  'expenses.delete': 'Delete Expenses',

  // Messages
  'messages.view': 'View Messages',
  'messages.send': 'Send Messages',

  // Analytics
  'analytics.view': 'View Analytics',

  // Settings
  'settings.lab_profile': 'Edit Lab Profile',
  'settings.branding': 'Edit Branding',
  'settings.website': 'Edit Website Settings',
  'settings.notifications': 'Configure Notifications',
  'settings.staff': 'Manage Staff & Roles',
  'settings.payments': 'Payment Settings',
  'settings.reports': 'Report Settings',
  'settings.security': 'Security Settings',

  // Audit
  'audit.view': 'View Audit Logs',
} as const;

export type Permission = keyof typeof ALL_PERMISSIONS;

// Default permissions per role
export const ROLE_PERMISSIONS: Record<StaffRole, Permission[]> = {
  super_admin: Object.keys(ALL_PERMISSIONS) as Permission[], // all permissions

  receptionist: [
    'dashboard.view',
    'bookings.view', 'bookings.create', 'bookings.update_status',
    'patients.view', 'patients.create', 'patients.edit',
    'reports.view', 'reports.download',
    'collections.view', 'collections.assign',
    'tests.view', 'packages.view',
    'slots.view', 'slots.manage',
    'payments.view', 'payments.record',
    'messages.view',
  ],

  lab_technician: [
    'dashboard.view',
    'bookings.view_assigned', 'bookings.update_status',
    'patients.view',
    'reports.view', 'reports.upload', 'reports.download',
    'tests.view', 'packages.view',
    'messages.view',
  ],

  collection_staff: [
    'dashboard.view',
    'collections.view_assigned', 'collections.update_status',
    'patients.view',
    'bookings.view_assigned',
  ],
};

// Role display names
export const ROLE_LABELS: Record<StaffRole, string> = {
  super_admin: 'Super Admin',
  receptionist: 'Receptionist',
  lab_technician: 'Lab Technician',
  collection_staff: 'Collection Staff',
};

// Check if a user has a specific permission
export function hasPermission(
  userRole: StaffRole,
  userPermissions: string[],
  permission: Permission
): boolean {
  // Super admin always has access
  if (userRole === 'super_admin') return true;

  // Check custom permissions first (overrides)
  if (userPermissions.includes(permission)) return true;

  // Fall back to role defaults
  const rolePerms = ROLE_PERMISSIONS[userRole] || [];
  return rolePerms.includes(permission);
}

// Check if a user has ANY of the given permissions
export function hasAnyPermission(
  userRole: StaffRole,
  userPermissions: string[],
  permissions: Permission[]
): boolean {
  return permissions.some(p => hasPermission(userRole, userPermissions, p));
}

// Sidebar items visible per role
export const SIDEBAR_PERMISSIONS: Record<string, Permission[]> = {
  '/admin': ['dashboard.view'],
  '/admin/bookings': ['bookings.view', 'bookings.view_assigned', 'bookings.create'],
  '/admin/patients': ['patients.view', 'patients.create'],
  '/admin/reports': ['reports.view', 'reports.upload'],
  '/admin/collections': ['collections.view', 'collections.view_assigned'],
  '/admin/tests': ['tests.view', 'packages.view'],
  '/admin/slots': ['slots.view', 'slots.manage'],
  '/admin/payments': ['payments.view', 'payments.record'],
  '/admin/expenses': ['expenses.view', 'expenses.create'],
  '/admin/messages': ['messages.view'],
  '/admin/analytics': ['analytics.view'],
  '/admin/settings': ['settings.lab_profile', 'settings.staff'],
};
