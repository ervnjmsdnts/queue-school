'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { requestNewOTPCode, validateOTP } from '../actions';
import { toast } from 'react-toastify';
import { schema, Schema } from '../schema';
import { zodResolver } from '@hookform/resolvers/zod';

export default function OTPForm({
  userId,
  userContactNumber,
  otp,
  otpExpiresAt,
}: {
  userId: string;
  userContactNumber: string;
  otp: string;
  otpExpiresAt: number;
}) {
  const form = useForm<Schema>({ resolver: zodResolver(schema) });

  const onRequestOTP = async () => {
    try {
      await requestNewOTPCode(userId, userContactNumber);
      toast.success('We have sent an OTP to your contact number');
    } catch (error) {
      toast.error('Something went wrong when requesting OTP');
    }
  };

  const onSubmit = async (data: Schema) => {
    if (data.code !== otp) {
      return toast.error('Incorrect One-Time Password');
    }

    const today = new Date().getTime();
    if (today > otpExpiresAt) {
      return toast.error(
        'One-Time Password has expired. Please request a new one-time password',
      );
    }

    try {
      await validateOTP(userId);
      toast.success('OTP verified. Redirecting you');
    } catch (error) {
      toast.error('Something went wrong when submitting OTP');
    }
  };

  const isLoading = false;
  return (
    <Card className='w-full max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>OTP</CardTitle>
        <CardDescription>
          Enter your one-time password below to access your account.
        </CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button disabled={isLoading} className='w-full'>
              {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
              Submit
            </Button>
          </form>
        </Form>
        <div className='mt-4 text-center text-sm'>
          <Button variant='link' onClick={onRequestOTP}>
            Request New OTP Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
