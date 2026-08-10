'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Legacy route — redirect to the new Patients page
export default function UsersPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/patients');
  }, [router]);
  return null;
}
