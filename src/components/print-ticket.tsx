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

const transactionsObject: Record<string, string> = {
  R: 'Residential',
  A: 'Agricultural',
  CO: 'Commercial',
  M: 'Machinery',
  BT: 'Business Tax',
  CE: 'Cedula',
  I: 'Industrial',
};

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
      <div className='flex items-center justify-center h-full max-w-lg w-full'>
        <div
          ref={ref}
          className='w-full flex flex-col border rounded-md container'>
          <div className='p-4'>
            <h3 className='text-lg font-semibold text-center pb-2'>
              Transaction Type
            </h3>
            <p className='text-center'>{transactionsObject[type]}</p>
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
                    <p>Ticket Number</p>
                  </div>
                  <h2 className='text-5xl font-bold text-center'>
                    {ticketNumber}
                  </h2>
                </div>
              </div>
              {!isPrint && (
                <div className='justify-self-end w-full pt-4'>
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
      </div>
    );
  },
);

PrintTicket.displayName = 'PrintTicket';

export default PrintTicket;
