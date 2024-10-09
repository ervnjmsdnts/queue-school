'use server';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Schema } from './schema';

export async function registerUser(data: Schema) {
  const { user } = await createUserWithEmailAndPassword(
    auth,
    data.email,
    data.password,
  );

  await setDoc(doc(db, 'users', user.uid), {
    ...data,
    role: 'user',
    createdAt: new Date().getTime(),
    isActive: true,
  });
}
