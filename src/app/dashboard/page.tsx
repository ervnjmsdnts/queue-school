'use client';

import { useMemo, useRef, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format, subDays } from 'date-fns';
import { CSVLink } from 'react-csv';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Chart from './_components/chart';
import { useCollection } from '@/hooks/use-collection';
import { Ticket } from '@/lib/types';
import { where } from 'firebase/firestore';
import { FileSpreadsheet, Loader2, Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

const initialDateRange: DateRange = {
  from: subDays(new Date(), 2),
  to: new Date(),
};

const classType: Record<string, string> = {
  A: 'Agricultural',
  CO: 'Commercial',
  R: 'Residential',
  M: 'Machinery',
  I: 'Industrial',
  BT: 'Business Tax',
  CE: 'Cedula',
};

export default function Dashboard() {
  const [date, setDate] = useState<DateRange | undefined>(initialDateRange);

  const tableRef = useRef<HTMLTableElement>(null);

  const { items, isLoading } = useCollection<Ticket>({
    collectionName: 'tickets',
    queryConstraints: [
      where('isComplete', '==', true),
      where('isActive', '==', true),
    ],
    sortField: 'createdAt',
    sortBy: 'asc',
  });

  const filteredTickets = useMemo(() => {
    if (!items || !date || !date.from) {
      return [];
    }

    const fromTime = new Date(date.from);
    fromTime.setHours(0, 0, 0, 0); // Start of the day

    const toTime = date.to
      ? new Date(date.to).setHours(23, 59, 59, 999)
      : new Date(date.from).setHours(23, 59, 59, 999);

    return items.filter(
      (item) =>
        item.createdAt >= fromTime.getTime() && item.createdAt <= toTime,
    );
  }, [items, date]);

  const printTable = useReactToPrint({
    contentRef: tableRef,
    documentTitle: 'table',
  });

  const csvData = useMemo(
    () =>
      filteredTickets.map((ticket) => ({
        Timestamp: format(ticket.createdAt, 'PPpp'),
        'Customer Name': ticket.customer.name,
        'Contact Number': ticket.customer?.contactNumber
          ? `'${ticket.customer.contactNumber}`
          : null,
        Class: classType[ticket.type],
        Counter: ticket.counter,
        'Time Transaction Complete': ticket?.completionDate
          ? format(ticket.completionDate, 'PPpp')
          : null,
      })),
    [filteredTickets],
  );

  const ticketsByCounter = useMemo(() => {
    // Use a Map to group and count tickets by counter name
    const counterMap = filteredTickets.reduce((acc, item) => {
      const counterName = `Counter ${item.counter}`;

      if (!acc.has(counterName)) {
        acc.set(counterName, 0);
      }

      acc.set(counterName, acc.get(counterName)! + 1);

      return acc;
    }, new Map<string, number>());

    // Convert the Map to an array of objects
    return Array.from(counterMap, ([name, count]) => ({ name, count }));
  }, [filteredTickets]);

  const ticketsByClass = useMemo(() => {
    const classMap = filteredTickets.reduce((acc, item) => {
      const className = `${classType[item.type]}`;

      if (!acc.has(className)) {
        acc.set(className, 0);
      }

      acc.set(className, acc.get(className)! + 1);

      return acc;
    }, new Map<string, number>());

    return Array.from(classMap, ([name, count]) => ({ name, count }));
  }, [filteredTickets]);

  return (
    <div className='p-4 flex-1 overflow-scroll flex flex-col gap-4'>
      {isLoading ? (
        <div className='w-full h-full flex justify-center items-center'>
          <Loader2 className='w-6 h-6 animate-spin' />
        </div>
      ) : (
        <>
          <div className='flex items-center justify-between gap-2'>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id='date'
                  variant={'outline'}
                  className={cn(
                    'w-[300px] justify-start text-left font-normal',
                    !date && 'text-muted-foreground',
                  )}>
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, 'LLL dd, y')} -{' '}
                        {format(date.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(date.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  initialFocus
                  mode='range'
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <div className='flex items-center gap-1'>
              <Button onClick={() => printTable()}>
                Print <Printer className='w-4 h-4 ml-2' />
              </Button>
              <Button asChild>
                <CSVLink data={csvData} filename='report'>
                  Export CSV
                  <FileSpreadsheet className='w-4 h-4 ml-2' />
                </CSVLink>
              </Button>
            </div>
          </div>
          {/* Table */}
          <div className='border max-h-[400px] overflow-y-auto'>
            <Table ref={tableRef}>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Contact Number</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Counter</TableHead>
                  <TableHead>Time Transaction Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket, index) => (
                  <TableRow key={index}>
                    <TableCell>{format(ticket.createdAt, 'PPpp')}</TableCell>
                    <TableCell>{ticket.customer.name}</TableCell>
                    <TableCell>{ticket.customer.contactNumber}</TableCell>
                    <TableCell>{classType[ticket.type]}</TableCell>
                    <TableCell>{ticket.counter}</TableCell>
                    <TableCell>
                      {format(ticket.completionDate!, 'PPpp')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Charts */}
          <div className='grid grid-cols-2 gap-4'>
            <Chart data={ticketsByCounter} title='Number of Transaction' />
            <Chart data={ticketsByClass} title='Transaction Per Class' />
          </div>
        </>
      )}
    </div>
  );
}
