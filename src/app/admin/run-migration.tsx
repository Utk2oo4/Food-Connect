// pages/admin/run-migration.tsx
'use client';

import { useEffect } from 'react';
import { getDocs, collection, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function RunMigration() {
  useEffect(() => {
    const setDefaultStatuses = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      snapshot.forEach(async (d) => {
        const data = d.data();
        if (!data.status && data.role !== 'admin') {
          await updateDoc(doc(db, 'users', d.id), { status: 'pending' });
          console.log(`Updated user ${d.id} with pending status`);
        }
      });
    };

    setDefaultStatuses();
  }, []);

  return <div>Migration script ran in background. Check console.</div>;
}
