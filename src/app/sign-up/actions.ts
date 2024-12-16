'use server';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Schema } from './schema';
import { generateRandomOTP } from '@/lib/utils';

export async function registerUser(data: Schema) {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password,
    );

    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000).getTime();

    await setDoc(doc(db, 'users', user.uid), {
      ...data,
      role: 'user',
      createdAt: new Date().getTime(),
      isActive: true,
      isOTPVerified: false,
      otp: generateRandomOTP(),
      otpExpiresAt,
    });
  } catch (error) {
    throw error;
  }
}
