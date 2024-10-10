'use client';
import ShowAnnouncement from '@/components/show-announcement';
import { Button } from '@/components/ui/button';
import { useCollection } from '@/hooks/use-collection';
import { type Ticket } from '@/lib/types';
import { getUserInfo } from '@/lib/utils';
import { where } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import PrintTicket from '@/components/print-ticket';

export default function Transaction() {
  const user = getUserInfo();
  const { items, isLoading } = useCollection<Ticket>({
    collectionName: 'tickets',
    queryConstraints: [
      where('isComplete', '==', false),
      where('isActive', '==', true),
      where('userId', '==', user?.id),
    ],
  });

  return (
    <div className='flex p-4 items-center justify-center flex-col flex-1 gap-2'>
      {isLoading ? (
        <div className='flex justify-center items-center w-full h-full'>
          <Loader2 className='w-6 h-6 animate-spin' />
        </div>
      ) : (
        <>
          {items.length > 0 ? (
            <PrintTicket {...items[0]} />
          ) : (
            <div className='flex-grow h-full grid place-items-center'>
              <div className='grid place-items-center gap-2'>
                <p>You are currently not in queue for a transaction</p>
                <Button asChild>
                  <Link href='/create-transaction'>Get Ticket</Link>
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <ShowAnnouncement />
    </div>
  );
}
