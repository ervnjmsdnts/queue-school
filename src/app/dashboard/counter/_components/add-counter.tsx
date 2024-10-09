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
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { addCounter } from '../actions';
import { schema, Schema } from '../schema';

export default function AddCounter() {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<Schema>({ resolver: zodResolver(schema) });

  const { mutate, isLoading } = useMutation({
    mutationFn: addCounter,
    onSuccess: (data) => {
      setIsOpen(false);
      toast.success('Successfully added counter');
    },
    onError: (error) => {
      toast.error((error as Error).message);
    },
  });

  const onSubmit = (data: Schema) => {
    mutate({
      ...data,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add New Counter</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Counter</DialogTitle>
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
                Add
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
