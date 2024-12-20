'use client';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
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
import { useMemo } from 'react';
import FilterTickets from './_components/filter-tickets';
import { useSearchParams } from 'next/navigation';

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
      <div className='flex gap-2 items-center'>
        <FilterTickets />
        <AddManual />
      </div>
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

  const searchParams = useSearchParams();

  const filter = searchParams.get('filter');

  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).getTime(); // Start of today
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).getTime(); // End of today

  const filteredTickets = useMemo(() => {
    if (!items || !filter) return [];

    // Separate tickets for today and upcoming
    const todayTickets = items.filter(
      (item) =>
        item.scheduleDate >= startOfDay && item.scheduleDate <= endOfDay,
    );

    const upcomingTickets = items.filter(
      (item) => item.scheduleDate > endOfDay,
    );

    if (filter === 'all') {
      return [...todayTickets, ...upcomingTickets];
    }

    const filters = filter.split(',');

    let filteredTodayTickets: Ticket[] = [];
    let filteredUpcomingTickets: Ticket[] = [];

    // Filter todayTickets if filters other than 'upcoming' are present
    if (filters.some((f) => f !== 'upcoming')) {
      filteredTodayTickets = todayTickets.filter((item) => {
        const status = item.isComplete
          ? 'complete'
          : !item.isActive
          ? 'cancelled'
          : item.scheduleDate > endOfDay
          ? 'upcoming'
          : 'pending';

        return filters.includes(status);
      });
    }

    // Filter upcomingTickets if 'upcoming' is in the filters
    if (filters.includes('upcoming')) {
      filteredUpcomingTickets = upcomingTickets.filter((item) => {
        const status = item.isComplete
          ? 'complete'
          : !item.isActive
          ? 'cancelled'
          : item.scheduleDate > endOfDay
          ? 'upcoming'
          : 'pending';

        return filters.includes(status);
      });
    }

    return [...filteredTodayTickets, ...filteredUpcomingTickets];
  }, [items, filter, startOfDay, endOfDay]);

  const numberInQueue = filteredTickets.length;

  const { currentItems, paginate, currentPage, totalPages } =
    usePagination<Ticket>(filteredTickets);

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
                              : item.scheduleDate > endOfDay
                              ? 'warning'
                              : 'pending' // Today
                          }>
                          {item.isComplete
                            ? 'Complete'
                            : !item.isActive
                            ? 'Cancelled'
                            : item.scheduleDate > endOfDay
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
