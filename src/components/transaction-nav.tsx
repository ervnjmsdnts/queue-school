'use client';
import Link from 'next/link';
import { Button } from './ui/button';
import { getUserInfo } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function TransactionNav() {
  const [user, setUser] = useState<any>(null);

  const handleLogout = async () => {
    await signOut(auth);

    await fetch('/api/logout');

    localStorage.removeItem('user');

    window.location.reload();
  };

  useEffect(() => {
    const userInfo = getUserInfo();
    setUser(userInfo);
  }, []);
  return (
    <nav className='border-b h-14'>
      <div className='flex h-full px-4 items-center justify-between'>
        <h4 className='font-semibold'>Hello, {user?.name}</h4>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </nav>
  );
}
