import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
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

export async function editCounter(payload: Schema & { id: string }) {
  const { id, ...data } = payload;
  await updateDoc(doc(db, 'counters', `${id}`), {
    ...data,
  });
}

export async function deactivateCounter(id: string) {
  await updateDoc(doc(db, 'counters', `${id}`), { isActive: false });
}

export async function activateCounter(id: string) {
  await updateDoc(doc(db, 'counters', `${id}`), { isActive: true });
}
