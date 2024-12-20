'use client';
import { CircleUser } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import ChangePassword from './change-password';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Navbar({ user }: { user: any }) {
  const [isOpenPass, setIsOpenPass] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);

    await fetch('/api/logout');

    localStorage.removeItem('user');

    window.location.reload();
  };
  return (
    <>
      <ChangePassword open={isOpenPass} onClose={() => setIsOpenPass(false)} />
      <div className='border-b min-h-14'>
        <div className='flex items-center justify-between h-full px-4'>
          <h2 className='font-semibold'>San Jose Occidental Mindoro</h2>
          <div className='flex items-center gap-2'>
            <div className='flex text-xs flex-col text-right'>
              <p className='font-semibold'>{user?.name}</p>
              <p>
                {user?.role
                  ? user?.role?.charAt(0)?.toUpperCase() + user?.role?.slice(1)
                  : ''}{' '}
                {user?.role === 'staff' && `(Counter ${user?.counter})`}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='secondary'
                  size='icon'
                  className='rounded-full'>
                  <CircleUser className='h-6 w-6' />
                  <span className='sr-only'>Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => setIsOpenPass(true)}>
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
}
