import ShowAnnouncement from '@/components/show-announcement';
import TransactionNav from '@/components/transaction-nav';
import { PropsWithChildren } from 'react';

export default function TransactionLayout({ children }: PropsWithChildren) {
  return (
    <div className='h-screen flex flex-col'>
      <TransactionNav />
      {children}
      <ShowAnnouncement />
    </div>
  );
}
