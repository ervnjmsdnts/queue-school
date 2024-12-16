import { db } from '@/lib/firebase';
import { clientConfig, serverConfig } from '@/lib/firebase/config';
import { User } from '@/lib/types';
import { doc, getDoc } from 'firebase/firestore';
import { CircleAlert, Loader2 } from 'lucide-react';
import { getTokens } from 'next-firebase-auth-edge';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import RequestOTPButton from './_components/request-otp-button';
import OTPForm from './_components/otp-form';
import TransactionNav from '@/components/transaction-nav';

export default async function OTPPage() {
  const tokens = await getTokens(cookies(), {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });

  if (!tokens) {
    notFound();
  }

  const decodedToken = tokens.decodedToken;

  const ref = doc(db, 'users', `${decodedToken.uid}`);

  const user = (await getDoc(ref)).data() as User;

  if (!user) {
    return (
      <div className='w-screen h-screen flex items-center justify-center'>
        <Loader2 className='w-12 h-12 animate-spin' />
      </div>
    );
  }

  if (user.isOTPVerified) {
    return redirect('/');
  }

  return (
    <div className='w-screen h-screen flex flex-col'>
      <TransactionNav user={user} />
      <div className='flex flex-grow items-center justify-center'>
        {!user.isOTPVerified && !user.otp && !user.otpExpiresAt ? (
          <div className='flex gap-3 flex-col items-center'>
            <CircleAlert className='w-8 h-8 text-red-500' />
            <p>You have no OTP Code associated with your account</p>
            <RequestOTPButton
              userId={decodedToken.uid}
              userContactNumber={user.contactNumber}
            />
          </div>
        ) : (
          <OTPForm
            userId={decodedToken.uid}
            userContactNumber={user.contactNumber}
            otp={user.otp!}
            otpExpiresAt={user.otpExpiresAt!}
          />
        )}
      </div>
    </div>
  );
}
