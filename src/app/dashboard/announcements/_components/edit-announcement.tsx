'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { Loader2, SquarePen } from 'lucide-react';
import { useState } from 'react';
import { schema, Schema } from '../schema';
import { addAnnouncement, editAnnouncement } from '../actions';
import { Textarea } from '@/components/ui/textarea';
import { Announcement } from '@/lib/types';

export default function EditAnnouncement({
  announcement,
}: {
  announcement: Announcement;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    values: announcement ? announcement : undefined,
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: editAnnouncement,
    onSuccess: (data) => {
      setIsOpen(false);
      toast.success('Successfully updated announcement');
    },
    onError: (error) => {
      toast.error((error as Error).message);
    },
  });

  const onSubmit = (data: Schema) => {
    mutate({
      ...data,
      id: announcement.id,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size='icon' variant='ghost'>
          <SquarePen className='w-4 h-4 text-primary' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Announcement</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type='button' variant='secondary'>
                  Close
                </Button>
              </DialogClose>
              <Button disabled={isLoading}>
                {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
