import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  orderBy,
} from 'firebase/firestore';

import type { FoodPost } from './types';

// Add a new food post
export async function addFoodPost(data: Omit<FoodPost, 'id' | 'expiryTime'> & { expiryTime: Date }) {
  const docRef = await addDoc(collection(db, 'foodPosts'), {
    ...data,
    expiryTime: Timestamp.fromDate(data.expiryTime),
  });

  return {
    id: docRef.id,
    ...data,
  };
}

// Fetch food posts filtered by city and status (optional)
export async function getAvailableFoodPosts(city: string) {
  const foodRef = collection(db, 'foodPosts');
  const q = query(foodRef, where('status', '==', 'Available'), where('city', '==', city));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      expiryTime: data.expiryTime.toDate(),
    } as FoodPost;
  });
}
