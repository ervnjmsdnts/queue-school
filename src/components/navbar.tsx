import { CircleUser } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function Navbar() {
  return (
    <div className='border-b min-h-14'>
      <div className='flex items-center justify-between h-full px-4'>
        <h2 className='font-semibold'>San Jose Occidental Mindoro</h2>
        <div className='flex items-center gap-2'>
          <div className='flex text-xs flex-col text-right'>
            <p className='font-semibold'>John Doe</p>
            <p>Admin</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='secondary' size='icon' className='rounded-full'>
                <CircleUser className='h-6 w-6' />
                <span className='sr-only'>Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem>Change Password</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
