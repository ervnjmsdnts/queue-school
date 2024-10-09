'use client';

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
import { Contact, Loader2, Trash } from 'lucide-react';
import AddStaff from './_components/add-staff';
import { useCollection } from '@/hooks/use-collection';
import { where } from 'firebase/firestore';
import usePagination from '@/hooks/use-pagination';
import Pagination from '@/components/pagination';
import EditStaff from './_components/edit-staff';
import { type Staff } from '@/lib/types';

function StaffHeader() {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center text-lg font-semibold gap-2'>
        <Contact className='w-8 h-8' />
        Staff
      </div>
      <AddStaff />
    </div>
  );
}

export default function Staff() {
  const { isLoading, items } = useCollection<Staff>({
    collectionName: 'users',
    queryConstraints: [
      where('isActive', '==', true),
      where('role', '==', 'staff'),
    ],
  });

  const { currentItems, currentPage, paginate, totalPages } =
    usePagination<Staff>(items);

  return (
    <div className='p-4 flex-1 flex flex-col'>
      <div className='flex flex-col h-full gap-4'>
        {isLoading ? (
          <div className='w-full h-full flex justify-center items-center'>
            <Loader2 className='w-6 h-6 animate-spin' />
          </div>
        ) : (
          <>
            <StaffHeader />
            <div className='border flex-grow h-0 overflow-y-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Email Address</TableHead>
                    <TableHead>Counter</TableHead>
                    <TableHead className='text-center'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.contactNumber}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>
                        <Badge variant='secondary'>Counter 1</Badge>
                      </TableCell>
                      <TableCell className='flex justify-center'>
                        <EditStaff staff={item} />
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
