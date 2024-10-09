'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Computer, Loader2, SquarePen, Trash } from 'lucide-react';
import AddCounter from './_components/add-counter';
import { useCollection } from '@/hooks/use-collection';
import { where } from 'firebase/firestore';
import { type Counter } from '@/lib/types';
import usePagination from '@/hooks/use-pagination';
import Pagination from '@/components/pagination';

function CounterHeader() {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center text-lg font-semibold gap-2'>
        <Computer className='w-8 h-8' />
        Counter
      </div>
      <AddCounter />
    </div>
  );
}

export default function Counter() {
  const { isLoading, items } = useCollection<Counter>({
    collectionName: 'counters',
    queryConstraints: [where('isActive', '==', true)],
  });

  const { currentItems, paginate, currentPage, totalPages } =
    usePagination<Counter>(items);
  return (
    <div className='p-4 flex-1 flex flex-col'>
      <div className='flex flex-col h-full gap-4'>
        {isLoading ? (
          <div className='w-full h-full flex justify-center items-center'>
            <Loader2 className='w-6 h-6 animate-spin' />
          </div>
        ) : (
          <>
            <CounterHeader />
            <div className='border flex-grow h-0 overflow-y-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Counter Number</TableHead>
                    <TableHead className='text-center'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.counterNum}</TableCell>
                      <TableCell className='flex justify-center'>
                        <Button size='icon' variant='ghost'>
                          <SquarePen className='w-4 h-4 text-primary' />
                        </Button>
                        <Button size='icon' variant='ghost'>
                          <Trash className='w-4 h-4 text-red-400' />
                        </Button>
                      </TableCell>
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
