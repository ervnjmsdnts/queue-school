'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { Loader2, SquarePen, Trash } from 'lucide-react';
import { useState } from 'react';
import { deleteAnnouncement } from '../actions';
import { Announcement } from '@/lib/types';

export default function DeleteAnnouncement({
  announcement,
}: {
  announcement: Announcement;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isLoading } = useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: (data) => {
      setIsOpen(false);
      toast.success('Successfully deleted announcement');
    },
    onError: (error) => {
      toast.error((error as Error).message);
    },
  });

  const onSubmit = () => {
    mutate(announcement.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size='icon' variant='ghost'>
          <Trash className='w-4 h-4 text-red-400' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Announcement</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this announcement?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              Close
            </Button>
          </DialogClose>
          <Button disabled={isLoading} onClick={onSubmit}>
            {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
