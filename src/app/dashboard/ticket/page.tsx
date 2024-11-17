'use client';
import PrintTicket from '@/components/print-ticket';
import { Button } from '@/components/ui/button';
import { useCollection } from '@/hooks/use-collection';
import { type Ticket } from '@/lib/types';
import { getUserInfo } from '@/lib/utils';
import { where } from 'firebase/firestore';
import { Loader2, Printer, TicketIcon } from 'lucide-react';
import { useMutation } from 'react-query';
import { completeTicket } from './actions';
import { toast } from 'react-toastify';
import { useMemo, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export default function Ticket() {
  const user = getUserInfo();

  // Get today's start and end timestamps
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).getTime(); // Start of today
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).getTime(); // End of today

  const { items, isLoading } = useCollection<Ticket>({
    collectionName: 'tickets',
    queryConstraints: [
      where('counter', '==', user?.counter),
      where('isComplete', '==', false),
      where('isActive', '==', true),
      // where('scheduleDate', '>=', startOfDay), // Only include tickets scheduled for today
      // where('scheduleDate', '<=', endOfDay),
    ],
    sortField: 'createdAt',
    sortBy: 'asc',
  });

  const scheduledItems = useMemo(() => {
    return (items || []).filter(
      (item) =>
        item.scheduleDate >= startOfDay && item.scheduleDate <= endOfDay,
    );
  }, [items, endOfDay, startOfDay]);

  const { isLoading: completeLoading, mutate } = useMutation({
    mutationFn: completeTicket,
    onError: (error) => {
      toast.error((error as Error).message);
    },
  });

  const printRef = useRef<HTMLDivElement>(null);

  const printTicket = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'ticket',
    pageStyle: '@page {margin: 0 !important;}',
  });

  return (
    <div className='flex-1 p-4 flex flex-col'>
      {isLoading ? (
        <div className='w-full h-full flex justify-center items-center'>
          <Loader2 className='w-6 h-6 animate-spin' />
        </div>
      ) : (
        <>
          <div className='flex items-center justify-between pb-4'>
            <div className='flex items-center text-lg font-semibold gap-2'>
              <TicketIcon className='w-8 h-8' />
              Ticket
            </div>
            {scheduledItems.length > 0 && (
              <Button onClick={() => printTicket()}>
                <Printer className='w-4 h-4 mr-2' />
                Print
              </Button>
            )}
          </div>
          {scheduledItems.length === 0 ? (
            <div className='flex items-center justify-center'>
              <h3 className='font-semibold text-muted-foreground text-2xl'>
                No Items in Queue
              </h3>
            </div>
          ) : (
            <>
              <div className='flex-grow max-w-lg w-full mx-auto'>
                <PrintTicket ref={printRef} isPrint {...scheduledItems[0]} />
              </div>
              <div className='self-end'>
                <Button
                  disabled={completeLoading}
                  onClick={() => mutate(scheduledItems[0].id)}>
                  {completeLoading && (
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  )}
                  Set as Complete
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
