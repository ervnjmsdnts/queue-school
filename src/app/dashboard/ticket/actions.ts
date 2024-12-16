import { db } from '@/lib/firebase';
import { Ticket } from '@/lib/types';
import { checkEnvironment } from '@/lib/utils';
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

export async function completeTicket(ticketId: string) {
  try {
    // get the tickets of today
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).getTime();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).getTime();

    const ticketsRef = collection(db, 'tickets');
    const q = query(
      ticketsRef,
      where('isComplete', '==', false),
      where('isActive', '==', true),
    );
    const ticketsSnapshot = await getDocs(q);

    const ticketsOfToday = ticketsSnapshot.docs
      .filter((ticket) => {
        const ticketData = ticket.data() as Ticket;
        return (
          ticketData.scheduleDate >= startOfDay &&
          ticketData.scheduleDate <= endOfDay
        );
      })
      .map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Ticket, 'id'>) }))
      .sort((a, b) => a.createdAt - b.createdAt);

    // get the index of the 11
    const completedTicketIndex = ticketsOfToday.findIndex(
      (ticket) => ticket.id === ticketId,
    );

    if (completedTicketIndex === -1) {
      throw new Error("Ticket not found in today's schedule");
    }

    const targetIndex = completedTicketIndex + 10;
    // send sms message to the 11
    if (targetIndex < ticketsOfToday.length) {
      const ticketToSendSMS = ticketsOfToday[targetIndex];

      if (ticketToSendSMS.ticketType && ticketToSendSMS.ticketType === 'user') {
        const res = await fetch(checkEnvironment().concat('/api/sms'), {
          method: 'POST',
          body: JSON.stringify({
            contactNumber: ticketToSendSMS.customer.contactNumber,
            message: `Your Ticket Number ${ticketToSendSMS.ticketNumber} is now 10th in line.`,
          }),
        });

        if (!res.ok) {
          throw new Error('Something went wrong');
        }
      }
    }
    await updateDoc(doc(db, 'tickets', `${ticketId}`), {
      isComplete: true,
      completionDate: new Date().getTime(),
      isCompleteView: false,
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
