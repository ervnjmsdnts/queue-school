'use client';

import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { addHours, format, subDays } from 'date-fns';
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

export default function Report() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 2),
    to: new Date(),
  });

  return (
    <div className='p-4 flex-1 overflow-scroll flex flex-col gap-4'>
      <div className='flex items-center gap-2'>
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
        <Button>Generate Report</Button>
      </div>
      {/* Table */}
      <div className='border max-h-[400px] overflow-y-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Counter</TableHead>
              <TableHead>Time Transaction Completed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {new Array(20).fill('').map((_, index) => (
              <TableRow key={index}>
                <TableCell>{format(new Date(), 'PPpp')}</TableCell>
                <TableCell>John Doe</TableCell>
                <TableCell>Completed</TableCell>
                <TableCell>09123456789</TableCell>
                <TableCell>Residential</TableCell>
                <TableCell>2</TableCell>
                <TableCell>{format(addHours(new Date(), 2), 'PPpp')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Charts */}
      <div className='grid grid-cols-2 gap-4'>
        <Chart title='Number of Transaction' />
        <Chart title='Transaction Per Class' />
      </div>
    </div>
  );
}
