'use server';
import { db } from '@/lib/firebase';
import { checkEnvironment, generateRandomOTP } from '@/lib/utils';
import { doc, updateDoc } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

export async function requestNewOTPCode(
  userId: string,
  userContactNumber: string,
) {
  try {
    const otpCode = generateRandomOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000).getTime();

    await updateDoc(doc(db, 'users', `${userId}`), {
      otp: otpCode,
      otpExpiresAt,
      isOTPVerified: false,
    });

    const res = await fetch(checkEnvironment().concat('/api/sms'), {
      method: 'POST',
      body: JSON.stringify({
        contactNumber: userContactNumber,
        message: `Your OTP code is: ${otpCode}. This code will expire in 5 minutes.`,
      }),
    });

    if (!res.ok) {
      throw new Error('Something went wrong');
    }

    const data = await res.json();

    console.log({ data });
    revalidatePath('/otp');
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function validateOTP(userId: string) {
  try {
    await updateDoc(doc(db, 'users', `${userId}`), {
      isOTPVerified: true,
    });

    revalidatePath('/otp');
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
