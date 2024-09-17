import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Check, ClipboardList, Trash } from 'lucide-react';

function QueueListHeader() {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center text-lg font-semibold gap-2'>
        <ClipboardList className='w-8 h-8' />
        Queue List
      </div>
      <h3 className='text-lg font-semibold'>Number in Queue: 1</h3>
    </div>
  );
}

export default function QueueList() {
  return (
    <div className='p-4 flex-1 flex flex-col'>
      <div className='flex flex-col h-full gap-4'>
        <QueueListHeader />
        <div className='border flex-grow h-0 overflow-y-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Ticket Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Serve</TableHead>
                <TableHead className='text-center'>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>R</TableCell>
                <TableCell>0201</TableCell>
                <TableCell>
                  <Badge variant='pending'>Pending</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant='secondary'>Counter 1</Badge>
                </TableCell>
                <TableCell className='flex justify-center'>
                  <Button size='icon' variant='ghost'>
                    <Check className='w-4 h-4 text-green-500' />
                  </Button>
                  <Button size='icon' variant='ghost'>
                    <Trash className='w-4 h-4 text-red-400' />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        {/* <div>Pagination</div> */}
      </div>
    </div>
  );
}
