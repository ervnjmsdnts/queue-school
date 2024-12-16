'use client';
import ShowAnnouncement from '@/components/show-announcement';
import { Button } from '@/components/ui/button';
import { useCollection } from '@/hooks/use-collection';
import { type Ticket } from '@/lib/types';
import { getUserInfo } from '@/lib/utils';
import { where } from 'firebase/firestore';
import { CircleCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import PrintTicket from '@/components/print-ticket';
import { useMemo } from 'react';
import { ticketViewed } from './actions';

export default function Transaction() {
  const user = getUserInfo();
  const { items: counterItems, isLoading: counterLoading } =
    useCollection<Ticket>({
      collectionName: 'tickets',
      queryConstraints: [
        where('isComplete', '==', false),
        where('isActive', '==', true),
        where('userId', '==', user?.id),
      ],
      sortField: 'createdAt',
    });

  const { items, isLoading: itemsLoading } = useCollection<Ticket>({
    collectionName: 'tickets',
    queryConstraints: [
      where('isComplete', '==', false),
      where('isActive', '==', true),
    ],
    sortField: 'createdAt',
    sortBy: 'asc',
  });

  const { items: completedItems, isLoading: completedLoading } =
    useCollection<Ticket>({
      collectionName: 'tickets',
      queryConstraints: [
        where('isComplete', '==', true),
        where('userId', '==', user?.id),
      ],
      sortField: 'createdAt',
    });

  const allNonViewedCompletedItems = useMemo(() => {
    return completedItems.filter((item) => !item.isCompleteView);
  }, [completedItems]);

  const counter = useMemo(
    () =>
      counterItems && counterItems.length > 0 ? counterItems[0].counter : null,
    [counterItems],
  );

  // Get today's start and end timestamps
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).getTime(); // Start of today
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).getTime(); // End of today

  const scheduledItems = useMemo(() => {
    return (items || []).filter(
      (item) =>
        item.scheduleDate >= startOfDay && item.scheduleDate <= endOfDay,
    );
  }, [items, endOfDay, startOfDay]);

  const numberInLine = useMemo(() => {
    return scheduledItems.findIndex(
      (item) => item.counter === counter && item.userId === user?.id,
    );
  }, [scheduledItems, counter, user?.id]);

  const isLoading = useMemo(
    () => counterLoading || itemsLoading || completedLoading,
    [counterLoading, itemsLoading, completedLoading],
  );

  return (
    <div className='flex p-4 items-center justify-center flex-col flex-1 gap-2'>
      {isLoading ? (
        <div className='flex justify-center items-center w-full h-full'>
          <Loader2 className='w-6 h-6 animate-spin' />
        </div>
      ) : (
        <>
          {allNonViewedCompletedItems.length > 0 ? (
            <div className='flex-grow h-full grid place-items-center'>
              <div className='flex flex-col gap-2 items-center'>
                <CircleCheck className='w-10 h-10 text-green-500' />
                <p>
                  Your ticket{' '}
                  <span className='font-bold'>
                    {allNonViewedCompletedItems[0].ticketNumber}
                  </span>{' '}
                  has been completed
                </p>
                <Button
                  onClick={() =>
                    ticketViewed(allNonViewedCompletedItems[0].id)
                  }>
                  Thank you
                </Button>
              </div>
            </div>
          ) : counterItems.length > 0 ? (
            <PrintTicket
              {...counterItems[0]}
              numberInLine={numberInLine !== -1 ? numberInLine + 1 : 0}
            />
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
