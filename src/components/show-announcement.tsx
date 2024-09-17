import { Megaphone } from 'lucide-react';
import { Button } from './ui/button';

export default function ShowAnnouncement() {
  return (
    <div className='sticky bg-white bottom-5 p-4 w-full'>
      <div className='border border-dashed p-4 w-full'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Megaphone className='w-6 h-6' />
            <p>Announcements</p>
          </div>
          <Button variant='outline'>Show</Button>
        </div>
      </div>
    </div>
  );
}
