'use client';
import { Button } from './ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function TransactionNav({ user }: { user: any }) {
  const handleLogout = async () => {
    await signOut(auth);

    await fetch('/api/logout');

    localStorage.removeItem('user');

    window.location.reload();
  };

  return (
    <nav className='border-b h-14'>
      <div className='flex h-full px-4 items-center justify-between'>
        <h4 className='font-semibold'>Hello, {user?.name}</h4>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </nav>
  );
}
