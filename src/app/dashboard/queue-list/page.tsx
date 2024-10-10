'use client';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Check, ClipboardList, Loader2, Trash } from 'lucide-react';

function QueueListHeader({ inQueue }: { inQueue: number }) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center text-lg font-semibold gap-2'>
        <ClipboardList className='w-8 h-8' />
        Queue List
      </div>
      <h3 className='text-lg font-semibold'>Number in Queue: {inQueue}</h3>
    </div>
  );
}

export default function QueueList() {
  const user = getUserInfo();
  const { items, isLoading } = useCollection<Ticket>({
    collectionName: 'tickets',
    queryConstraints: [where('counter', '==', user?.counter)],
    sortField: 'createdAt',
    sortBy: 'asc',
  });

  const numberInQueue = items?.filter((item) => !item.isComplete)?.length;

  console.log(items);

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
                              : 'pending'
                          }>
                          {item.isComplete
                            ? 'Complete'
                            : !item.isActive
                            ? 'Cancelled'
                            : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant='secondary'>
                          Counter {item.counter}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(item.createdAt, 'PPpp')}</TableCell>
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
