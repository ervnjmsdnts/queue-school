import { db } from '@/lib/firebase';
import { Schema } from './schema';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { getUserInfo } from '@/lib/utils';

export async function addTicket(payload: Schema) {
  try {
    const user = await getUserInfo();
    if (!user) throw new Error('User not found');

    // Get the latest ticket number
    const ticketsRef = collection(db, 'tickets');
    const q = query(ticketsRef, orderBy('ticketNumber', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);

    let newTicketNumber = 1;
    if (!querySnapshot.empty) {
      const latestTicket = querySnapshot.docs[0].data();
      newTicketNumber = parseInt(latestTicket.ticketNumber, 10) + 1;
    }

    const paddedTicketNumber = String(newTicketNumber).padStart(4, '0');

    await addDoc(collection(db, 'tickets'), {
      createdAt: new Date().getTime(),
      isActive: true,
      userId: user.id,
      isComplete: false,
      ticketNumber: paddedTicketNumber,
      ...payload,
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function cancelTicket(ticketId: string) {
  try {
    await updateDoc(doc(db, 'tickets', `${ticketId}`), {
      isActive: false,
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
