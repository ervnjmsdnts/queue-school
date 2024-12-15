'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ExternalLink, Loader2, Megaphone } from 'lucide-react';
import { useCollection } from '@/hooks/use-collection';
import { where } from 'firebase/firestore';
import { type Announcement } from '@/lib/types';
import usePagination from '@/hooks/use-pagination';
import Pagination from '@/components/pagination';
import AddAnnouncement from './_components/add-announcement';
import EditAnnouncement from './_components/edit-announcement';
import DeleteAnnouncement from './_components/delete-announcement';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function AnnouncementHeader() {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center text-lg font-semibold gap-2'>
        <Megaphone className='w-8 h-8' />
        Announcements
      </div>
      <AddAnnouncement />
    </div>
  );
}

export default function Announcements() {
  const { isLoading, items } = useCollection<Announcement>({
    collectionName: 'announcements',
    queryConstraints: [where('isActive', '==', true)],
  });

  const { currentItems, paginate, currentPage, totalPages } =
    usePagination<Announcement>(items);
  return (
    <div className='p-4 flex-1 flex flex-col'>
      <div className='flex flex-col h-full gap-4'>
        {isLoading ? (
          <div className='w-full h-full flex justify-center items-center'>
            <Loader2 className='w-6 h-6 animate-spin' />
          </div>
        ) : (
          <>
            <AnnouncementHeader />
            <div className='border flex-grow h-0 overflow-y-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Video</TableHead>
                    <TableHead className='text-center'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell className='max-w-96 truncate'>
                        {item.description}
                      </TableCell>
                      <TableCell>
                        {item.imageUrl && item.imageName && (
                          <Button variant='link' className='p-0' asChild>
                            <Link href={item.imageUrl} target='_blank'>
                              View <ExternalLink className='w-4 h-4 ml-2' />
                            </Link>
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.videoUrl && item.videoName && (
                          <Button variant='link' className='p-0' asChild>
                            <Link href={item.videoUrl} target='_blank'>
                              View <ExternalLink className='w-4 h-4 ml-2' />
                            </Link>
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className='flex justify-center'>
                        <EditAnnouncement announcement={item} />
                        <DeleteAnnouncement announcement={item} />
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
