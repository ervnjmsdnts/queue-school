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
import { useMemo, useState } from 'react';
import { ticketViewed } from './actions';

export default function Transaction() {
  const user = getUserInfo();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
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

  const startOfDay = new Date(
    new Date(counterItems[0]?.scheduleDate).setHours(0, 0, 0, 0),
  ).getTime(); // Start of day
  const endOfDay = new Date(
    new Date(counterItems[0]?.scheduleDate).setHours(23, 59, 59, 999),
  ).getTime(); // End of day

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
              <div className='flex flex-col gap-4 items-center'>
                <div className='grid gap-1 place-items-center'>
                  <CircleCheck className='w-10 h-10 text-green-500' />
                  <p>
                    Your ticket{' '}
                    <span className='font-bold'>
                      {allNonViewedCompletedItems[0].ticketNumber}
                    </span>{' '}
                    has been completed
                  </p>
                  <p>Please rate our service</p>
                </div>
                <div className='grid place-items-center gap-8'>
                  <div className='flex items-center gap-2'>
                    {[1, 2, 3, 4, 5].map((item) => (
                      <Button
                        onClick={() =>
                          setSelectedRating((prev) =>
                            prev === item ? null : item,
                          )
                        }
                        key={item}
                        className='text-lg'
                        variant={
                          selectedRating === item ? 'default' : 'outline'
                        }>
                        {item}
                      </Button>
                    ))}
                  </div>
                  <Button
                    disabled={!selectedRating}
                    onClick={() =>
                      ticketViewed(
                        allNonViewedCompletedItems[0].id,
                        selectedRating,
                      )
                    }>
                    Submit
                  </Button>
                </div>
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
