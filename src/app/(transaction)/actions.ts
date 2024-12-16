import { db } from '@/lib/firebase';
import { getUserInfo } from '@/lib/utils';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';

export async function ticketViewed(id: string, rating: number | null) {
  try {
    const user = await getUserInfo();
    if (!user) throw new Error('User not found');

    if (!rating) throw new Error('Rating is required');

    await addDoc(collection(db, 'ratings'), {
      createdAt: new Date().getTime(),
      isActive: true,
      rating,
      customer: {
        name: user.name,
        contactNumber: user.contactNumber,
      },
    });
    await updateDoc(doc(db, 'tickets', `${id}`), {
      isCompleteView: true,
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
