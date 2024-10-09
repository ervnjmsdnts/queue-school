import { addDoc, collection } from 'firebase/firestore';
import { Schema } from './schema';
import { db } from '@/lib/firebase';

export async function addCounter(payload: Schema) {
  try {
    await addDoc(collection(db, 'counters'), {
      createdAt: new Date().getTime(),
      isActive: true,
      ...payload,
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
