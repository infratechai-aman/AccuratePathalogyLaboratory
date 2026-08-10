// ============================================================
// Notification Service (Event-Based)
// ============================================================

import { db } from '../firebase';
import { collection, doc, setDoc, getDocs, query, where, orderBy, limit, Timestamp, updateDoc } from 'firebase/firestore';
import { Notification, NotificationEvent, NotificationType, MessageStatus } from '../types';

// Notification templates
const TEMPLATES: Record<NotificationEvent, { subject: string; body: (data: Record<string, string>) => string }> = {
  booking_created: {
    subject: 'Booking Confirmed',
    body: (d) => `Your booking ${d.bookingId} with ${d.labName} has been confirmed for ${d.date} at ${d.time}.`,
  },
  payment_received: {
    subject: 'Payment Received',
    body: (d) => `Payment of ₹${d.amount} received for booking ${d.bookingId}. Thank you!`,
  },
  sample_collected: {
    subject: 'Sample Collected',
    body: (d) => `Your sample for ${d.testName} has been collected successfully. Report will be ready soon.`,
  },
  collection_assigned: {
    subject: 'Home Collection Scheduled',
    body: (d) => `Your home collection has been scheduled for ${d.date} at ${d.time}. Our staff ${d.staffName} will visit.`,
  },
  report_uploaded: {
    subject: 'Report Uploaded',
    body: (d) => `Your report for ${d.testName} has been uploaded and is under review.`,
  },
  report_verified: {
    subject: 'Report Verified',
    body: (d) => `Your report for ${d.testName} has been verified by our team.`,
  },
  report_ready: {
    subject: 'Report Ready',
    body: (d) => `Your report for ${d.testName} is ready. View your report: ${d.reportLink}`,
  },
  report_delivered: {
    subject: 'Report Delivered',
    body: (d) => `Your report for ${d.testName} has been delivered. Thank you for choosing ${d.labName}!`,
  },
};

/**
 * Create a notification record
 */
export async function createNotification(
  tenantId: string,
  patientId: string,
  patientName: string,
  event: NotificationEvent,
  type: NotificationType,
  data: Record<string, string>
): Promise<string> {
  const template = TEMPLATES[event];
  const message = template.body(data);

  const notifRef = doc(collection(db, 'notifications'));
  await setDoc(notifRef, {
    id: notifRef.id,
    tenantId,
    patientId,
    patientName,
    type,
    event,
    message,
    status: 'pending' as MessageStatus,
    createdAt: Timestamp.now(),
  });

  return notifRef.id;
}

/**
 * Update notification status
 */
export async function updateNotificationStatus(
  notificationId: string,
  status: MessageStatus
): Promise<void> {
  const docRef = doc(db, 'notifications', notificationId);
  await updateDoc(docRef, {
    status,
    ...(status === 'sent' || status === 'delivered' ? { sentAt: Timestamp.now() } : {}),
  });
}

/**
 * Get notifications for a tenant
 */
export async function getNotifications(
  tenantId: string,
  limitCount = 50
): Promise<Notification[]> {
  const q = query(
    collection(db, 'notifications'),
    where('tenantId', '==', tenantId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      sentAt: data.sentAt?.toDate?.() || undefined,
    } as Notification;
  });
}

/**
 * Trigger notification for an event (creates notifications for all configured channels)
 */
export async function triggerEventNotification(
  tenantId: string,
  patientId: string,
  patientName: string,
  event: NotificationEvent,
  data: Record<string, string>,
  channels: NotificationType[] = ['whatsapp', 'system']
): Promise<void> {
  for (const channel of channels) {
    await createNotification(tenantId, patientId, patientName, event, channel, data);
  }
}
