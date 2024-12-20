'use client';
import { Clock, Loader2, Megaphone } from 'lucide-react';
import { Button } from './ui/button';
import { useCollection } from '@/hooks/use-collection';
import { where } from 'firebase/firestore';
import { Announcement } from '@/lib/types';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import { format } from 'date-fns';
import { useState } from 'react';
import AnnouncementDialog from './announcement-dialog';

function Announcements({ items }: { items: Announcement[] }) {
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  const handleClose = () => {
    setSelectedAnnouncement(null);
  };

  return (
    <>
      <AnnouncementDialog
        announcement={selectedAnnouncement}
        handleClose={handleClose}
      />
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant='outline'>Show</Button>
        </DrawerTrigger>
        <DrawerContent className='h-[90%]'>
          <DrawerHeader>
            <DrawerTitle className='flex items-center gap-1'>
              <Megaphone className='w-6 h-6 mr-2' />
              Announcements
            </DrawerTitle>
          </DrawerHeader>
          <div className='grid gap-2 p-4'>
            {items.map((item) => (
              <div
                className='border rounded-md p-4'
                onClick={() => setSelectedAnnouncement(item)}
                key={item.id}>
                <div className='flex justify-between items-center'>
                  <h4 className='font-semibold max-w-60 truncate'>
                    {item.title}
                  </h4>
                  <div className='text-right leading-4 text-muted-foreground text-sm'>
                    <p>{format(item.createdAt, 'PP')}</p>
                    <p>{format(item.createdAt, 'p')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default function ShowAnnouncement() {
  const { isLoading, items } = useCollection<Announcement>({
    collectionName: 'announcements',
    queryConstraints: [where('isActive', '==', true)],
    sortField: 'createdAt',
  });

  return (
    <div className='border border-dashed rounded-md p-4 w-full'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Megaphone className='w-6 h-6' />
          <div className='flex items-center gap-1'>
            <p>Announcements</p>

            {isLoading ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              `(${items.length})`
            )}
          </div>
        </div>
        <Announcements items={items} />
      </div>
    </div>
  );
}
