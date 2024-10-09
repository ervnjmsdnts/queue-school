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
import { addCounter, editCounter } from '../actions';
import { schema, Schema } from '../schema';
import { Counter } from '@/lib/types';

export default function EditCounter({ counter }: { counter: Counter }) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    values: counter ? counter : undefined,
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: editCounter,
    onSuccess: (data) => {
      setIsOpen(false);
      toast.success('Successfully updated counter');
    },
    onError: (error) => {
      toast.error((error as Error).message);
    },
  });

  const onSubmit = (data: Schema) => {
    mutate({
      ...data,
      id: counter.id,
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
          <DialogTitle>Update Counter</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
            <FormField
              control={form.control}
              name='counterNum'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Counter Number</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} />
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
