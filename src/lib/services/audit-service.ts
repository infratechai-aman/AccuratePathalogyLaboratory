// ============================================================
// Audit Log Service
// ============================================================

import { db } from '../firebase';
import { collection, doc, setDoc, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { AuditLog, StaffRole } from '../types';

/**
 * Log an audit action
 */
export async function logAudit(
  tenantId: string,
  userId: string,
  userName: string,
  userRole: StaffRole,
  action: string,
  recordType: string,
  recordId?: string,
  details?: string
): Promise<void> {
  try {
    const auditRef = doc(collection(db, 'auditLogs'));
    await setDoc(auditRef, {
      id: auditRef.id,
      tenantId,
      userId,
      userName,
      userRole,
      action,
      recordType,
      recordId: recordId || '',
      details: details || '',
      timestamp: Timestamp.now(),
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}

/**
 * Get audit logs for a tenant
 */
export async function getAuditLogs(
  tenantId: string,
  limitCount = 50
): Promise<AuditLog[]> {
  const q = query(
    collection(db, 'auditLogs'),
    where('tenantId', '==', tenantId),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      timestamp: data.timestamp?.toDate?.() || new Date(),
    } as AuditLog;
  });
}

/**
 * Get audit logs for a specific record
 */
export async function getAuditLogsForRecord(
  tenantId: string,
  recordType: string,
  recordId: string
): Promise<AuditLog[]> {
  const q = query(
    collection(db, 'auditLogs'),
    where('tenantId', '==', tenantId),
    where('recordType', '==', recordType),
    where('recordId', '==', recordId),
    orderBy('timestamp', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      timestamp: data.timestamp?.toDate?.() || new Date(),
    } as AuditLog;
  });
}
