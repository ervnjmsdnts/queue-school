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

export default function Ticket() {
  const user = getUserInfo();
  const { items, isLoading } = useCollection<Ticket>({
    collectionName: 'tickets',
    queryConstraints: [
      where('counter', '==', user?.counter),
      where('isComplete', '==', false),
      where('isActive', '==', true),
    ],
    sortField: 'createdAt',
    sortBy: 'asc',
  });

  const { isLoading: completeLoading, mutate } = useMutation({
    mutationFn: completeTicket,
    onError: (error) => {
      toast.error((error as Error).message);
    },
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
            {items.length > 0 && (
              <Button>
                <Printer className='w-4 h-4 mr-2' />
                Print
              </Button>
            )}
          </div>
          {items.length === 0 ? (
            <div className='flex items-center justify-center'>
              <h3 className='font-semibold text-muted-foreground text-2xl'>
                No Items in Queue
              </h3>
            </div>
          ) : (
            <>
              <div className='flex-grow max-w-lg w-full mx-auto'>
                <PrintTicket isPrint {...items[0]} />
              </div>
              <div className='self-end'>
                <Button
                  disabled={completeLoading}
                  onClick={() => mutate(items[0].id)}>
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
