import { doc, updateDoc } from 'firebase/firestore';
import { EditSchema, Schema } from './schema';
import { db } from '@/lib/firebase';

export async function addStaff(payload: Schema) {
  try {
    const res = await fetch('/api/add-staff', {
      body: JSON.stringify({
        ...payload,
        role: 'staff',
        createdAt: new Date().getTime(),
        isActive: true,
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error((data as Error).message || 'Failed');
    }
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function editStaff(payload: EditSchema) {
  const { id, ...data } = payload;
  await updateDoc(doc(db, 'users', `${id}`), {
    ...data,
  });
}
