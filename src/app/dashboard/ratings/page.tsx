'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Star } from 'lucide-react';
import { useCollection } from '@/hooks/use-collection';
import { Rating } from '@/lib/types';
import usePagination from '@/hooks/use-pagination';
import Pagination from '@/components/pagination';
import { format } from 'date-fns';
import { useMemo } from 'react';

function RatingsHeader({ average }: { average: number }) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center text-lg font-semibold gap-2'>
        <Star className='w-8 h-8' />
        Ratings
      </div>
      <p className='font-semibold'>Avg. Rating: {average}</p>
    </div>
  );
}

export default function Ratings() {
  const { isLoading, items } = useCollection<Rating>({
    collectionName: 'ratings',
  });

  const averageRating = useMemo(() => {
    if (!items || items.length === 0) return 0;

    const activeRatings = items.filter((item) => item.isActive);
    const total = activeRatings.reduce((sum, item) => sum + item.rating, 0);
    return activeRatings.length > 0 ? total / activeRatings.length : 0;
  }, [items]);

  const { currentItems, paginate, currentPage, totalPages } =
    usePagination<Rating>(items);
  return (
    <div className='p-4 flex-1 flex flex-col'>
      <div className='flex flex-col h-full gap-4'>
        {isLoading ? (
          <div className='w-full h-full flex justify-center items-center'>
            <Loader2 className='w-6 h-6 animate-spin' />
          </div>
        ) : (
          <>
            <RatingsHeader average={averageRating} />
            <div className='border flex-grow h-0 overflow-y-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Name</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.customer.name}</TableCell>
                      <TableCell>{item.rating}</TableCell>
                      <TableCell>{format(item.createdAt, 'PP')}</TableCell>
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
