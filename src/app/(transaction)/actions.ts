import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function ticketViewed(id: string) {
  try {
    await updateDoc(doc(db, 'tickets', `${id}`), {
      isCompleteView: true,
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
