import { signInWithEmailAndPassword } from 'firebase/auth';
import { Schema } from './schema';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function signInUser(data: Schema) {
  const credentials = await signInWithEmailAndPassword(
    auth,
    data.email,
    data.password,
  );

  const idToken = await credentials.user.getIdToken();

  const userDoc = doc(db, 'users', credentials.user.uid);

  const user = (await getDoc(userDoc)).data();

  await fetch('/api/login', {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  return { ...user, id: userDoc.id };
}
