'use client';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCollection } from '@/hooks/use-collection';
import usePagination from '@/hooks/use-pagination';
import { Ticket } from '@/lib/types';
import { getUserInfo } from '@/lib/utils';
import { format } from 'date-fns';
import { where } from 'firebase/firestore';
import { ClipboardList, Loader2 } from 'lucide-react';
import AddManual from './_components/add-manual';

function QueueListHeader({ inQueue }: { inQueue: number }) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center text-lg font-semibold gap-2'>
        <ClipboardList className='w-8 h-8' />
        <div className='flex flex-col'>
          <p className='leading-5'>Queue List</p>
          <h3 className='text-sm font-semibold text-muted-foreground'>
            Number in Queue: {inQueue}
          </h3>
        </div>
      </div>
      <AddManual />
    </div>
  );
}

export default function QueueList() {
  const user = getUserInfo();
  const { items, isLoading } = useCollection<Ticket>({
    collectionName: 'tickets',
    queryConstraints: [
      where('counter', '==', user?.counter),
      where('isActive', '==', true),
      where('isComplete', '==', false),
    ],
    sortField: 'scheduleDate',
    sortBy: 'asc',
  });

  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).getTime(); // Start of today
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).getTime(); // End of today

  const numberInQueue = items?.filter(
    (item) =>
      !item.isComplete &&
      item.scheduleDate >= startOfDay && // Item's scheduleDate falls within today
      item.scheduleDate <= endOfDay,
  )?.length;

  const { currentItems, paginate, currentPage, totalPages } =
    usePagination<Ticket>(items);

  return (
    <div className='p-4 flex-1 flex flex-col'>
      <div className='flex flex-col h-full gap-4'>
        {isLoading ? (
          <div className='w-full h-full flex justify-center items-center'>
            <Loader2 className='w-6 h-6 animate-spin' />
          </div>
        ) : (
          <>
            <QueueListHeader inQueue={numberInQueue || 0} />
            <div className='border flex-grow h-0 overflow-y-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Ticket Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Serve</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    {/* <TableHead className='text-center'>Action</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.ticketNumber}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.isComplete
                              ? 'complete'
                              : !item.isActive
                              ? 'destructive'
                              : new Date(item.scheduleDate).getTime() <
                                startOfDay
                              ? 'warning' // Missed
                              : new Date(item.scheduleDate).getTime() > endOfDay
                              ? 'default' // Upcoming
                              : 'pending' // Today
                          }>
                          {item.isComplete
                            ? 'Complete'
                            : !item.isActive
                            ? 'Cancelled'
                            : new Date(item.scheduleDate).getTime() < startOfDay
                            ? 'Missed'
                            : new Date(item.scheduleDate).getTime() > endOfDay
                            ? 'Upcoming'
                            : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant='secondary'>
                          Counter {item.counter}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(item.createdAt, 'PP')}</TableCell>
                      <TableCell>{format(item.scheduleDate, 'PP')}</TableCell>
                      {/* <TableCell className='flex justify-center'>
                        <Button size='icon' variant='ghost'>
                          <Check className='w-4 h-4 text-green-500' />
                        </Button>
                        <Button size='icon' variant='ghost'>
                          <Trash className='w-4 h-4 text-red-400' />
                        </Button>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className='self-end'>
              <Pagination
                totalPages={totalPages}
                paginate={paginate}
                currentPage={currentPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
