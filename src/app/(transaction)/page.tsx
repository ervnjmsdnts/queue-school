'use client';
import ShowAnnouncement from '@/components/show-announcement';
import { Button } from '@/components/ui/button';
import { useCollection } from '@/hooks/use-collection';
import { type Ticket } from '@/lib/types';
import { cn, getUserInfo } from '@/lib/utils';
import { format } from 'date-fns';
import { where } from 'firebase/firestore';
import { Calendar, Loader2, Ticket as TicketIcon } from 'lucide-react';
import Link from 'next/link';
import { HTMLAttributes } from 'react';
import { useMutation } from 'react-query';
import { cancelTicket } from './create-transaction/actions';
import { toast } from 'react-toastify';

const transactions = [
  { value: 'R', label: 'Residential' },
  { value: 'A', label: 'Agricultural' },
  { value: 'CO', label: 'Commercial' },
  { value: 'M', label: 'Machinery' },
  { value: 'BT', label: 'Business Tax' },
  { value: 'CE', label: 'Cedula' },
  { value: 'I', label: 'Industrial' },
];

interface TransactionTypes extends HTMLAttributes<HTMLParagraphElement> {
  label: string;
  value: string;
  ticketValue: string;
}

function Types({ label, value, ticketValue, ...rest }: TransactionTypes) {
  return (
    <p
      className={cn(
        'text-center rounded-full',
        value === ticketValue && 'bg-green-500',
      )}
      {...rest}>
      {label}
    </p>
  );
}

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

  const { mutate, isLoading: cancelLoading } = useMutation({
    mutationFn: cancelTicket,
    onError: () => {
      toast.error('Something went wrong when cancelling your queue position');
    },
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
            <div className='w-full flex-grow h-full flex flex-col border rounded-md container'>
              <div className='p-4'>
                <h3 className='font-semibold text-lg pb-2'>Transactions</h3>
                <div className='p-4 border rounded-sm'>
                  <div className='grid grid-cols-2'>
                    <div className='grid gap-1 items-start'>
                      {transactions.slice(0, 3).map((t) => (
                        <Types
                          value={t.value}
                          key={t.value}
                          label={t.label}
                          ticketValue={items[0].type}
                        />
                      ))}
                    </div>
                    <div className='grid gap-1'>
                      {transactions.slice(3).map((t) => (
                        <Types
                          key={t.value}
                          value={t.value}
                          ticketValue={items[0].type}
                          label={t.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className='p-4'>
                <div className='flex flex-col gap-2 items-center'>
                  <p>You are currently number</p>
                  <h2 className='text-5xl font-bold'>1</h2>
                  <p>
                    In line for{' '}
                    <span className='font-semibold'>
                      Counter {items[0].counter}
                    </span>
                  </p>
                </div>
              </div>
              <hr />
              <div className='p-4 h-full'>
                <div className='flex flex-col h-full'>
                  <div className='flex flex-col gap-4 flex-grow'>
                    <div className='flex items-center gap-2 justify-center'>
                      <Calendar className='w-6 h-6' />
                      <p>{format(items[0].createdAt, 'PP')}</p>
                    </div>
                    <div className='flex flex-col gap-2'>
                      <div className='flex items-center gap-2 justify-center'>
                        <TicketIcon className='w-6 h-6' />
                        <p>Your Ticket Number</p>
                      </div>
                      <h2 className='text-5xl font-bold text-center'>
                        {items[0].ticketNumber}
                      </h2>
                    </div>
                  </div>
                  <div className='justify-self-end w-full'>
                    <Button
                      onClick={() => mutate(items[0].id)}
                      disabled={cancelLoading}
                      className='w-full'>
                      {cancelLoading && (
                        <Loader2 className='w-4 h-4 animate-spin mr-2' />
                      )}
                      Cancel Queue Position
                    </Button>
                  </div>
                </div>
              </div>
            </div>
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
