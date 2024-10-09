'use client';
import Link from 'next/link';
import {
  ClipboardList,
  Computer,
  Contact,
  LayoutDashboard,
  Megaphone,
  Sheet,
  Ticket,
  Users,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const items = [
  { name: 'Dashboard', route: '/dashboard', icon: LayoutDashboard },
  { name: 'Staff', route: '/dashboard/staff', icon: Contact },
  { name: 'Counter', route: '/dashboard/counter', icon: Computer },
  { name: 'Queue List', route: '/dashboard/queue-list', icon: ClipboardList },
  { name: 'Ticket', route: '/dashboard/ticket', icon: Ticket },
  { name: 'Report', route: '/dashboard/report', icon: Sheet },
  { name: 'Announcement', route: '/dashboard/announcement', icon: Megaphone },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className='flex w-[20%] border-r max-h-screen flex-col gap-2'>
      <div className='flex font-semibold gap-2 h-14 items-center border-b px-4'>
        <Users className='h-6 w-6' />
        <span className=''>Queueing</span>
      </div>
      <div className='flex-1'>
        <nav className='grid items-start font-medium px-4'>
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.route}
              className={cn(
                'flex items-center gap-3 rounded-lg py-2 px-3 text-muted-foreground transition-all hover:text-primary',
                pathname === item.route && 'text-primary bg-muted',
              )}>
              <item.icon className='h-4 w-4' />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
