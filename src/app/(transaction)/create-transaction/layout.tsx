import { db } from '@/lib/firebase';
import { clientConfig, serverConfig } from '@/lib/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getTokens } from 'next-firebase-auth-edge';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

export default async function CreateTransactionLayout({
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
  const userUid = decodedToken.uid;

  const ticketsRef = collection(db, 'tickets');
  const ticketsQuery = query(
    ticketsRef,
    where('userId', '==', userUid),
    where('isComplete', '==', false),
    where('isActive', '==', true),
  );
  const ticketDocs = await getDocs(ticketsQuery);

  if (!ticketDocs.empty) {
    return redirect('/');
  }

  return children;
}
