'use client';
import { Calendar, TicketIcon, Loader2, Check } from 'lucide-react';
import { Button } from './ui/button';
import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useMutation } from 'react-query';
import { cancelTicket } from '@/app/(transaction)/create-transaction/actions';
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
  isPrint?: boolean;
}

function Types({
  label,
  value,
  ticketValue,
  isPrint = false,
  ...rest
}: TransactionTypes) {
  if (isPrint) {
    return (
      <p className='text-center flex items-center gap-2'>
        {value === ticketValue && <Check className='w-4 h-4' />}
        {label}
      </p>
    );
  }
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

type PrintTicketType = {
  type: string;
  counter: number;
  scheduleDate: number;
  ticketNumber: string;
  isPrint?: boolean;
  id: string;
};

const PrintTicket = forwardRef<HTMLDivElement, PrintTicketType>(
  (
    {
      type,
      counter,
      scheduleDate,
      ticketNumber,
      isPrint = false,
      id,
    }: PrintTicketType,
    ref,
  ) => {
    const { mutate, isLoading: cancelLoading } = useMutation({
      mutationFn: cancelTicket,
      onError: () => {
        toast.error('Something went wrong when cancelling your queue position');
      },
    });
    return (
      <div
        ref={ref}
        className='w-full flex-grow h-full flex flex-col border rounded-md container'>
        <div className='p-4'>
          <h3 className='font-semibold text-lg pb-2'>Transactions</h3>
          <div className='p-4 border rounded-sm'>
            <div className='grid grid-cols-2'>
              <div className='grid gap-1 items-start'>
                {transactions.slice(0, 3).map((t) => (
                  <Types
                    isPrint={isPrint}
                    value={t.value}
                    key={t.value}
                    label={t.label}
                    ticketValue={type}
                  />
                ))}
              </div>
              <div className='grid gap-1'>
                {transactions.slice(3).map((t) => (
                  <Types
                    isPrint={isPrint}
                    key={t.value}
                    value={t.value}
                    ticketValue={type}
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
              <span className='font-semibold'>Counter {counter}</span>
            </p>
          </div>
        </div>
        <hr />
        <div className='p-4 h-full'>
          <div className='flex flex-col h-full'>
            <div className='flex flex-col gap-4 flex-grow'>
              <div className='flex items-center gap-2 justify-center'>
                <Calendar className='w-6 h-6' />
                <p>{format(scheduleDate, 'PP')}</p>
              </div>
              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-2 justify-center'>
                  <TicketIcon className='w-6 h-6' />
                  <p>Your Ticket Number</p>
                </div>
                <h2 className='text-5xl font-bold text-center'>
                  {ticketNumber}
                </h2>
              </div>
            </div>
            {!isPrint && (
              <div className='justify-self-end w-full'>
                <Button
                  onClick={() => mutate(id)}
                  disabled={cancelLoading}
                  className='w-full'>
                  {cancelLoading && (
                    <Loader2 className='w-4 h-4 animate-spin mr-2' />
                  )}
                  Cancel Queue Position
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

PrintTicket.displayName = 'PrintTicket';

export default PrintTicket;
