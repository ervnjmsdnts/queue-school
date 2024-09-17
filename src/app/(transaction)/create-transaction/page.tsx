import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CreateTransaction() {
  return (
    <div className='p-4 flex flex-col gap-4 lg:container lg:mx-auto'>
      <div>
        <h1 className='text-lg font-semibold'>Municipality Treasury Office</h1>
        <Badge variant='outline'>
          Rizal Street, Barangay Poblacion VII, San Jose
        </Badge>
      </div>
      <ToggleGroup
        className='justify-start flex-col items-start gap-2'
        variant='outline'
        type='single'>
        <ToggleGroupItem
          className='w-full text-lg py-6 px-4 justify-between'
          value='a'>
          <p>Monday</p>
          <p>8:00AM - 5:00PM</p>
        </ToggleGroupItem>
        <ToggleGroupItem
          className='w-full text-lg py-6 px-4 justify-between'
          value='b'>
          <p>Tuesday</p>
          <p>8:00AM - 5:00PM</p>
        </ToggleGroupItem>
        <ToggleGroupItem
          className='w-full text-lg py-6 px-4 justify-between'
          value='c'>
          <p>Wednesday</p>
          <p>8:00AM - 5:00PM</p>
        </ToggleGroupItem>
        <ToggleGroupItem
          className='w-full text-lg py-6 px-4 justify-between'
          value='d'>
          <p>Thursday</p>
          <p>8:00AM - 5:00PM</p>
        </ToggleGroupItem>
        <ToggleGroupItem
          className='w-full text-lg py-6 px-4 justify-between'
          value='e'>
          <p>Friday</p>
          <p>8:00AM - 5:00PM</p>
        </ToggleGroupItem>
      </ToggleGroup>
      <div>
        <h3 className='font-semibold pb-2'>Type of Transaction</h3>
        <div className='border p-2'>
          <RadioGroup defaultValue='option-one'>
            <div className='grid grid-cols-2 place-items-start'>
              <div className='flex flex-col gap-2'>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='option-one' id='option-one' />
                  <Label className='text-base' htmlFor='option-one'>
                    Residential
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='option-two' id='option-two' />
                  <Label htmlFor='option-two' className='text-base'>
                    Agricultural
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='commercial' id='option-two' />
                  <Label htmlFor='option-two' className='text-base'>
                    Commercial
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='industrial' id='option-two' />
                  <Label htmlFor='option-two' className='text-base'>
                    Industrial
                  </Label>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='machinery' id='option-one' />
                  <Label htmlFor='option-one' className='text-base'>
                    Machinery
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='business-tax' id='option-one' />
                  <Label htmlFor='business-tax' className='text-base'>
                    Business Tax
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='cedula' id='option-one' />
                  <Label htmlFor='business-tax' className='text-base'>
                    Cedula
                  </Label>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>
      <div className='flex w-full items-center gap-2 lg:justify-center'>
        <Button asChild className='w-full' variant='outline'>
          <Link href='/transaction'>Cancel</Link>
        </Button>
        <Button className='w-full'>Get Ticket</Button>
      </div>
    </div>
  );
}
