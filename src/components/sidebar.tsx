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
  {
    name: 'Dashboard',
    route: '/dashboard',
    icon: LayoutDashboard,
    role: 'admin',
  },
  { name: 'Staff', route: '/dashboard/staff', icon: Contact, role: 'admin' },
  {
    name: 'Counter',
    route: '/dashboard/counter',
    icon: Computer,
    role: 'admin',
  },
  {
    name: 'Queue List',
    route: '/dashboard/queue-list',
    icon: ClipboardList,
    role: 'staff',
  },
  { name: 'Ticket', route: '/dashboard/ticket', icon: Ticket, role: 'staff' },
  {
    name: 'Announcement',
    route: '/dashboard/announcements',
    icon: Megaphone,
    role: 'admin',
  },
];

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();
  return (
    <div className='flex w-[20%] border-r max-h-screen flex-col gap-2'>
      <div className='flex font-semibold gap-2 h-14 items-center border-b px-4'>
        <Users className='h-6 w-6' />
        <span className=''>Queueing</span>
      </div>
      <div className='flex-1'>
        <nav className='grid items-start font-medium px-4'>
          {items
            .filter((item) => item.role === 'all' || item.role === user?.role)
            .map((item, index) => (
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
