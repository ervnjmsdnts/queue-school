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
import { Label } from '@/components/ui/label';

export default function SignUpForm() {
  return (
    <Card className='mx-auto max-w-sm w-full'>
      <CardHeader>
        <CardTitle className='text-xl'>Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid gap-4'>
          <div className='grid gap-2'>
            <Label htmlFor='name'>Name</Label>
            <Input id='name' placeholder='Max' required />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              placeholder='m@example.com'
              required
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='contact'>Contact Number</Label>
            <Input id='contact' required />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='password'>Password</Label>
            <Input id='password' type='password' />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='confirmPassword'>Confirm Password</Label>
            <Input id='confirmPassword' type='password' />
          </div>
          <Button type='submit' className='w-full'>
            Create an account
          </Button>
        </div>
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
