'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '../../../components/ui/form';
import { schema, Schema } from '../schema';
import { useMutation } from 'react-query';
import { signInUser } from '../actions';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

export default function LoginForm() {
  const form = useForm<Schema>({ resolver: zodResolver(schema) });

  const { mutate, isLoading } = useMutation({
    mutationFn: signInUser,
    onError: (error) => {
      toast.error((error as Error).message);
    },
    onSuccess: (data) => {
      localStorage.setItem('user', JSON.stringify(data));
      window.location.reload();
    },
  });

  const onSubmit = (data: Schema) => {
    mutate(data);
  };

  return (
    <Card className='w-full max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type='password' />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button disabled={isLoading} className='w-full'>
              {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
              Sign In
            </Button>
          </form>
        </Form>
        <div className='mt-4 text-center text-sm'>
          Don&apos;t have an account?{' '}
          <Link href='/sign-up' className='underline'>
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
