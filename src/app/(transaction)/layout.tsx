import ShowAnnouncement from '@/components/show-announcement';
import TransactionNav from '@/components/transaction-nav';
import { db } from '@/lib/firebase';
import { clientConfig, serverConfig } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { getTokens } from 'next-firebase-auth-edge';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

export default async function TransactionLayout({
  children,
}: PropsWithChildren) {
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

  if (user && (user.role === 'admin' || user.role === 'staff')) {
    if (user.role === 'admin') {
      redirect('/dashboard');
    } else if (user.role === 'staff') {
      redirect('/dashboard/queue-list');
    }
  }

  return (
    <div className='h-screen flex flex-col'>
      <TransactionNav user={user} />
      {children}
    </div>
  );
}
