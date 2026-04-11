'use client';

import React, { useState } from 'react';
import { sampleBookings, sampleSlots, sampleTests, sampleUsers } from '@/lib/sample-data';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

export default function SeedDatabasePage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');

  const seedData = async () => {
    try {
      setLoading(true);
      setStatus('Starting seeding process...');

      // Seed Tests
      setStatus('Seeding tests...');
      const testsCol = collection(db, 'tests');
      for (const test of sampleTests) {
        await setDoc(doc(testsCol, test.id), test);
      }

      // Seed Slots
      setStatus('Seeding slots...');
      const slotsCol = collection(db, 'slots');
      for (const slot of sampleSlots) {
        await setDoc(doc(slotsCol, slot.id), slot);
      }

      // Seed Bookings
      setStatus('Seeding bookings...');
      const bookingsCol = collection(db, 'bookings');
      for (const booking of sampleBookings) {
        await setDoc(doc(bookingsCol, booking.id), booking);
      }

      // Seed Users
      setStatus('Seeding users...');
      const usersCol = collection(db, 'users');
      for (const user of sampleUsers) {
        await setDoc(doc(usersCol, user.uid), user);
      }

      setStatus('Seeding complete! You can now delete this page.');
    } catch (error: any) {
      console.error(error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Seeder</h1>
      <p className="mb-4 text-gray-600">This will overwrite and seed the Firestore database with sample data.</p>
      
      <button 
        onClick={seedData} 
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        {loading ? 'Seeding...' : 'Run Seeder'}
      </button>

      {status && (
        <div className="p-4 bg-gray-100 rounded border">
          <p className="font-mono text-sm">{status}</p>
        </div>
      )}
    </div>
  );
}
