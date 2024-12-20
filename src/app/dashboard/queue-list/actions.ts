import { getUserInfo } from '@/lib/utils';
import { Schema } from './schema';
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function addTicket(payload: Schema) {
  try {
    const user = await getUserInfo();
    if (!user) throw new Error('User not found');

    const { customerContact, customerName, ...rest } = payload;

    // Get today's date
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Map day strings to numeric values
    const dayMap: Record<string, number> = {
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
    };

    // Calculate the difference in days between today and the selected day
    const selectedDay = dayMap[payload.scheduleDate.toLowerCase()];
    if (selectedDay === undefined) {
      throw new Error('Invalid schedule day selected');
    }

    let dayDifference = selectedDay - currentDay;
    if (dayDifference < 0) {
      // If the selected day is in the next week
      dayDifference += 7;
    }

    // Calculate the date for the selected day
    const scheduleDate = new Date(today);
    scheduleDate.setDate(today.getDate() + dayDifference);

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
      isComplete: false,
      ticketNumber: paddedTicketNumber,
      counter: user.counter,
      ticketType: 'manual',
      isCompleteView: true,
      ...rest,
      scheduleDate: scheduleDate.getTime(),
      customer: {
        name: customerName,
        contactNumber: customerContact,
      },
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
