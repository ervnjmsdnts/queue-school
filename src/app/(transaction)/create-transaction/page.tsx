'use client';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCollection } from '@/hooks/use-collection';
import { where } from 'firebase/firestore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Counter } from '@/lib/types';
import { schema, Schema } from './schema';
import { useMutation } from 'react-query';
import { addTicket } from './actions';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

export default function CreateTransaction() {
  const form = useForm<Schema>({ resolver: zodResolver(schema) });
  const { items: counters, isLoading: counterLoading } = useCollection<Counter>(
    {
      collectionName: 'counters',
      queryConstraints: [where('isActive', '==', true)],
    },
  );

  const { mutate, isLoading } = useMutation({
    mutationFn: addTicket,
    onSuccess: () => {
      window.location.reload();
    },
    onError: (error) => {
      toast.error((error as Error).message);
    },
  });

  const onSubmit = (data: Schema) => {
    mutate({ ...data });
  };

  return (
    <div className='p-4 flex flex-col gap-4 lg:container lg:mx-auto'>
      <div>
        <h1 className='text-lg font-semibold'>Municipality Treasury Office</h1>
        <Badge variant='outline'>
          Rizal Street, Barangay Poblacion VII, San Jose
        </Badge>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-4'>
          <FormField
            control={form.control}
            name='scheduleDate'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-bold text-base'>Schedule</FormLabel>
                <FormControl>
                  <ToggleGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className='justify-start flex-col items-start gap-2'
                    variant='outline'
                    type='single'>
                    <ToggleGroupItem
                      className='w-full text-lg py-6 px-4 justify-between'
                      value='monday'>
                      <p>Monday</p>
                      <p>8:00AM - 5:00PM</p>
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      className='w-full text-lg py-6 px-4 justify-between'
                      value='tuesday'>
                      <p>Tuesday</p>
                      <p>8:00AM - 5:00PM</p>
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      className='w-full text-lg py-6 px-4 justify-between'
                      value='wednesday'>
                      <p>Wednesday</p>
                      <p>8:00AM - 5:00PM</p>
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      className='w-full text-lg py-6 px-4 justify-between'
                      value='thursday'>
                      <p>Thursday</p>
                      <p>8:00AM - 5:00PM</p>
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      className='w-full text-lg py-6 px-4 justify-between'
                      value='friday'>
                      <p>Friday</p>
                      <p>8:00AM - 5:00PM</p>
                    </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name='counter'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-semibold text-base'>
                  Counter
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger disabled={counterLoading}>
                      <SelectValue placeholder='Select counter' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {counters.map((counter) => (
                      <SelectItem
                        key={counter.id}
                        value={counter.counterNum.toString()}>
                        Counter {counter.counterNum}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='type'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-semibold text-base'>
                  Type of Transaction
                </FormLabel>
                <FormControl>
                  <div className='border p-2'>
                    <RadioGroup
                      defaultValue={field.value}
                      onValueChange={field.onChange}>
                      <div className='grid grid-cols-2 place-items-start'>
                        <div className='flex flex-col gap-2'>
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='R' id='option-one' />
                            </FormControl>
                            <FormLabel
                              htmlFor='option-one'
                              className='text-base'>
                              Residential
                            </FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='A' id='option-two' />
                            </FormControl>
                            <FormLabel
                              htmlFor='option-two'
                              className='text-base'>
                              Agricultural
                            </FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='CO' id='option-three' />
                            </FormControl>
                            <FormLabel
                              htmlFor='option-three'
                              className='text-base'>
                              Commercial
                            </FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='I' id='option-four' />
                            </FormControl>
                            <FormLabel
                              htmlFor='option-four'
                              className='text-base'>
                              Industrial
                            </FormLabel>
                          </FormItem>
                        </div>
                        <div className='flex flex-col gap-2'>
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='M' id='option-five' />
                            </FormControl>
                            <FormLabel
                              htmlFor='option-five'
                              className='text-base'>
                              Machinery
                            </FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='BT' id='option-six' />
                            </FormControl>
                            <FormLabel
                              htmlFor='option-six'
                              className='text-base'>
                              Business Tax
                            </FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='CE' id='option-seven' />
                            </FormControl>
                            <FormLabel
                              htmlFor='option-seven'
                              className='text-base'>
                              Cedula
                            </FormLabel>
                          </FormItem>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <div className='flex w-full items-center gap-2 lg:justify-center'>
            <Button asChild className='w-full' type='button' variant='outline'>
              <Link href='/transaction'>Cancel</Link>
            </Button>
            <Button className='w-full' disabled={isLoading}>
              {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
              Get Ticket
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
