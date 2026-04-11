import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUserByUid, createUserProfile, getBookingsByUser } from '@/lib/services/db';

// Mock dependencies
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
  getApps: vi.fn(() => []),
}));

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/firestore')>();
  
  // Custom mock Timestamp
  class MockTimestamp {
    toDate() { return new Date('2026-04-11T12:00:00Z'); }
    static now() { return new MockTimestamp(); }
    static fromDate() { return new MockTimestamp(); }
  }
  
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(),
    doc: vi.fn((db, path, id) => ({ id: id || 'auto-id' })),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    Timestamp: MockTimestamp
  };
});

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
}));

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(),
}));

describe('Database Service QA Testing', () => {
  let firestoreMock: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    firestoreMock = await import('firebase/firestore');
  });

  it('QA-101: getUserByUid - Returns parsed user if document exists', async () => {
    // Setup Mock
    firestoreMock.getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ name: 'John Doe', email: 'john@example.com' }),
      id: 'mock-uid-123'
    });

    const user = await getUserByUid('mock-uid-123');

    expect(firestoreMock.doc).toHaveBeenCalledWith(expect.anything(), 'users', 'mock-uid-123');
    expect(firestoreMock.getDoc).toHaveBeenCalled();
    expect(user).toEqual({ name: 'John Doe', email: 'john@example.com', uid: 'mock-uid-123' });
  });

  it('QA-102: getUserByUid - Returns null if document is missing', async () => {
    firestoreMock.getDoc.mockResolvedValueOnce({ exists: () => false });
    const user = await getUserByUid('missing-uid');
    expect(user).toBeNull();
  });

  it('QA-201: createUserProfile - Properly forms payload and calls setDoc', async () => {
    const mockData = { name: 'New User', email: 'new@example.com' };
    await createUserProfile('new-uid-789', mockData);

    expect(firestoreMock.doc).toHaveBeenCalledWith(expect.anything(), 'users', 'new-uid-789');
    expect(firestoreMock.setDoc).toHaveBeenCalledWith(
      { id: 'new-uid-789' }, 
      {
        ...mockData,
        uid: 'new-uid-789',
        createdAt: expect.anything()
      }
    );
  });

  it('QA-301: getBookingsByUser - Executes query and extracts data correctly', async () => {
    firestoreMock.getDocs.mockResolvedValueOnce({
      docs: [
        { data: () => ({ testId: 't1', status: 'pending' }), id: 'book-1' },
        { data: () => ({ testId: 't2', status: 'completed' }), id: 'book-2' }
      ]
    });

    const bookings = await getBookingsByUser('user123');

    expect(firestoreMock.collection).toHaveBeenCalledWith(expect.anything(), 'bookings');
    expect(firestoreMock.where).toHaveBeenCalledWith('userId', '==', 'user123');
    expect(firestoreMock.getDocs).toHaveBeenCalled();
    expect(bookings.length).toBe(2);
    expect(bookings[0]).toEqual({ testId: 't1', status: 'pending', id: 'book-1' });
    expect(bookings[1]).toEqual({ testId: 't2', status: 'completed', id: 'book-2' });
  });
});
