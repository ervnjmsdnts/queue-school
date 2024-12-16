import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Filter } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const items = [
  { value: 'pending', label: 'Pending' },
  { value: 'complete', label: 'Complete' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function FilterTickets() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const onChangeChecked = (checked: boolean, item: string) => {
    const params = new URLSearchParams(searchParams);
    const currentFilter = params.get('filter');

    let selectedFilters =
      currentFilter === 'all'
        ? items.map((i) => i.value)
        : currentFilter
        ? currentFilter.split(',')
        : [];

    if (checked) {
      if (!selectedFilters.includes(item)) {
        selectedFilters.push(item);
      }
    } else {
      selectedFilters = selectedFilters.filter((filter) => filter !== item);
    }

    if (selectedFilters.length === items.length) {
      params.set('filter', 'all');
    } else if (selectedFilters.length === 0) {
      params.delete('filter');
    } else {
      params.set('filter', selectedFilters.join(','));
    }

    router.push(`?${params.toString()}`);
  };

  const isChecked = (item: string) => {
    const currentFilter = searchParams.get('filter');

    if (currentFilter === 'all') return true;

    if (!currentFilter) return false;

    const selectedFilters = currentFilter.split(',');
    return selectedFilters.includes(item);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size='icon' variant='outline'>
          <Filter className='w-4 h-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full'>
        <div className='grid gap-3'>
          {items.map((item) => (
            <div key={item.value} className='flex items-center gap-1'>
              <Checkbox
                id={item.value}
                checked={isChecked(item.value)}
                onCheckedChange={(checked) =>
                  onChangeChecked(checked as boolean, item.value)
                }
              />
              <label
                htmlFor={item.value}
                className='text-sm text-muted-foreground'>
                {item.label}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
