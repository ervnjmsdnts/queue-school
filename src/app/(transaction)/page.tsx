import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Transaction() {
  return (
    <div className='flex items-center justify-center flex-col flex-1 gap-2'>
      <p>You are currently not in queue for a transaction</p>
      <Button asChild>
        <Link href='/create-transaction'>Get Ticket</Link>
      </Button>
    </div>
  );
}
