import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { db } from '@/lib/firebase';
import { clientConfig, serverConfig } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { getTokens } from 'next-firebase-auth-edge';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { PropsWithChildren, Suspense } from 'react';

export default async function DashboardLayout({ children }: PropsWithChildren) {
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

  const user = (await getDoc(ref)).data();

  if (user && user.role === 'user') {
    redirect('/');
  }
  return (
    <div className='h-screen flex'>
      <Sidebar user={user} />
      <div className='w-[80%] flex flex-col overflow-scroll'>
        <Navbar user={user} />
        <Suspense fallback='Loading...'>{children}</Suspense>
      </div>
    </div>
  );
}
