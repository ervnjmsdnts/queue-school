import Link from 'next/link';
import { Button } from './ui/button';

export default function TransactionNav() {
  return (
    <nav className='border-b h-14'>
      <div className='flex h-full px-4 items-center justify-between'>
        <h4 className='font-semibold'>Hello, John Doe</h4>
        <Button asChild>
          <Link href='/'>Logout</Link>
        </Button>
      </div>
    </nav>
  );
}
