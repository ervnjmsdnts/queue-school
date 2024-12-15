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
import { Loader2, CircleSlash } from 'lucide-react';
import { useState } from 'react';
import { Counter } from '@/lib/types';
import { deactivateCounter } from '../actions';

export default function DeactivateCounter({ counter }: { counter: Counter }) {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isLoading } = useMutation({
    mutationFn: deactivateCounter,
    onSuccess: (data) => {
      setIsOpen(false);
      toast.success('Successfully deactivated counter');
    },
    onError: (error) => {
      toast.error((error as Error).message);
    },
  });

  const onSubmit = () => {
    mutate(counter.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size='icon' variant='ghost'>
          <CircleSlash className='w-4 h-4 text-red-400' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deactivate Counter</DialogTitle>
          <DialogDescription>
            Are you sure you want to deactivate this counter?
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
            Deactivate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
