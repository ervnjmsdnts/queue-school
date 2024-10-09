import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { Schema } from './schema';
import { db } from '@/lib/firebase';

export async function addAnnouncement(payload: Schema) {
  try {
    await addDoc(collection(db, 'announcements'), {
      createdAt: new Date().getTime(),
      isActive: true,
      ...payload,
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function editAnnouncement(payload: Schema & { id: string }) {
  const { id, ...data } = payload;
  await updateDoc(doc(db, 'announcements', `${id}`), {
    ...data,
  });
}
