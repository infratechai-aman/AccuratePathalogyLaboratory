// ============================================================
// Human-Readable ID Generator
// ============================================================
// Generates IDs like LAB-10245, PAT-000245, RPT-00123, etc.
// Uses a simple in-memory counter with timestamp fallback.
// In production, use Firestore counter documents for uniqueness.

import { db } from './firebase';
import { doc, getDoc, setDoc, increment, runTransaction } from 'firebase/firestore';

type IdPrefix = 'LAB' | 'PAT' | 'RPT' | 'COL' | 'PAY';

const ID_CONFIG: Record<IdPrefix, { pad: number; start: number }> = {
  LAB: { pad: 5, start: 10000 },  // LAB-10245
  PAT: { pad: 6, start: 1 },      // PAT-000245
  RPT: { pad: 5, start: 1 },      // RPT-00123
  COL: { pad: 5, start: 1 },      // COL-00456
  PAY: { pad: 5, start: 1 },      // PAY-00789
};

/**
 * Generate a unique human-readable ID.
 * Uses Firestore counter for sequential IDs per tenant.
 */
export async function generateId(tenantId: string, prefix: IdPrefix): Promise<string> {
  const config = ID_CONFIG[prefix];
  const counterPath = `tenants/${tenantId}/counters/${prefix.toLowerCase()}`;

  try {
    const newCount = await runTransaction(db, async (transaction) => {
      const counterRef = doc(db, counterPath);
      const counterSnap = await transaction.get(counterRef);

      let currentCount = config.start;
      if (counterSnap.exists()) {
        currentCount = (counterSnap.data().value || config.start) + 1;
      }

      transaction.set(counterRef, { value: currentCount }, { merge: true });
      return currentCount;
    });

    return `${prefix}-${String(newCount).padStart(config.pad, '0')}`;
  } catch {
    // Fallback: timestamp-based ID if transaction fails
    const ts = Date.now().toString().slice(-6);
    return `${prefix}-${ts}`;
  }
}

/**
 * Quick ID generator (no Firestore, for demo/seed data)
 */
export function generateQuickId(prefix: IdPrefix, counter: number): string {
  const config = ID_CONFIG[prefix];
  const num = config.start + counter;
  return `${prefix}-${String(num).padStart(config.pad, '0')}`;
}
