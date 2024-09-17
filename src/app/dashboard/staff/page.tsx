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
import { Contact, SquarePen, Trash } from 'lucide-react';

function StaffHeader() {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center text-lg font-semibold gap-2'>
        <Contact className='w-8 h-8' />
        Staff
      </div>
      <Button>Add New Staff</Button>
    </div>
  );
}

export default function Staff() {
  return (
    <div className='p-4 flex-1 flex flex-col'>
      <div className='flex flex-col h-full gap-4'>
        <StaffHeader />
        <div className='border flex-grow h-0 overflow-y-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Counter</TableHead>
                <TableHead className='text-center'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>John Doe</TableCell>
                <TableCell>09123456789</TableCell>
                <TableCell>Some Address</TableCell>
                <TableCell>johndoe@email.com</TableCell>
                <TableCell>
                  <Badge variant='secondary'>Counter 1</Badge>
                </TableCell>
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
