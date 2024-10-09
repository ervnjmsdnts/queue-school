'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '../../../components/ui/form';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import { useMutation } from 'react-query';
import { useRouter } from 'next/navigation';
import { registerUser } from '../actions';
import { schema, Schema } from '../schema';

export default function SignUpForm() {
  const form = useForm<Schema>({ resolver: zodResolver(schema) });

  const router = useRouter();

  const { mutate, isLoading } = useMutation({
    onSuccess: () => {
      toast.success('Successfully registered');
      router.push('/sign-in');
    },
    onError: (error) => {
      toast.error((error as Error).message);
    },
    mutationFn: registerUser,
  });

  const onSubmit = (data: Schema) => {
    mutate(data);
  };

  return (
    <Card className='mx-auto max-w-sm w-full'>
      <CardHeader>
        <CardTitle className='text-xl'>Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
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
              name='contactNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
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
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type='password' />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button disabled={isLoading} type='submit' className='w-full'>
              {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
              Create an account
            </Button>
          </form>
        </Form>
        <div className='mt-4 text-center text-sm'>
          Already have an account?{' '}
          <Link href='/' className='underline'>
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
