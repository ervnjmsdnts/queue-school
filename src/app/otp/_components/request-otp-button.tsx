'use client';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { requestNewOTPCode } from '../actions';

export default function RequestOTPButton({
  userId,
  userContactNumber,
}: {
  userId: string;
  userContactNumber: string;
}) {
  const onRequestOTP = async () => {
    try {
      await requestNewOTPCode(userId, userContactNumber);
      toast.success('We have sent an OTP to your contact number');
    } catch (error) {
      toast.error('Something went wrong when requesting OTP');
    }
  };
  return <Button onClick={onRequestOTP}>Request OTP Code</Button>;
}
