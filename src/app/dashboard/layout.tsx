import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { PropsWithChildren } from 'react';

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className='h-screen flex'>
      <Sidebar />
      <div className='w-[80%] flex flex-col overflow-scroll'>
        <Navbar />
        {children}
      </div>
    </div>
  );
}
