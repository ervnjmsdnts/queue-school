import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function completeTicket(ticketId: string) {
  try {
    await updateDoc(doc(db, 'tickets', `${ticketId}`), {
      isComplete: true,
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
