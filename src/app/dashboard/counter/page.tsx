import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Computer, Contact, SquarePen, Trash } from 'lucide-react';

function CounterHeader() {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center text-lg font-semibold gap-2'>
        <Computer className='w-8 h-8' />
        Counter
      </div>
      <Button>Add New Counter</Button>
    </div>
  );
}

export default function Counter() {
  return (
    <div className='p-4 flex-1 flex flex-col'>
      <div className='flex flex-col h-full gap-4'>
        <CounterHeader />
        <div className='border flex-grow h-0 overflow-y-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Counter Number</TableHead>
                <TableHead className='text-center'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell className='flex justify-center'>
                  <Button size='icon' variant='ghost'>
                    <SquarePen className='w-4 h-4 text-primary' />
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
