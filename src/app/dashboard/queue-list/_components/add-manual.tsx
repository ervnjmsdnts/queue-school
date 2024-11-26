import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { schema, Schema } from '../schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useMutation } from 'react-query';
import { addTicket } from '../actions';
import { toast } from 'react-toastify';

export default function AddManual() {
  const form = useForm<Schema>({ resolver: zodResolver(schema) });

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

  const [disabledDays, setDisabledDays] = useState<string[]>([]);

  useEffect(() => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Map day numbers to toggle values
    const dayMap = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];

    // Disable logic: Disable all if weekend, otherwise disable past days
    if (currentDay === 0 || currentDay === 6) {
      setDisabledDays(dayMap); // Disable all for weekends
    } else {
      setDisabledDays(dayMap.slice(0, currentDay)); // Disable days earlier than today
    }
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Manually</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add ticket manually</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='scheduleDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold text-base'>
                    Schedule
                  </FormLabel>
                  <FormControl>
                    <ToggleGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className='justify-start flex-col items-start gap-2'
                      variant='outline'
                      type='single'>
                      {[
                        'monday',
                        'tuesday',
                        'wednesday',
                        'thursday',
                        'friday',
                      ].map((day) => (
                        <ToggleGroupItem
                          disabled={disabledDays.includes(day)}
                          key={day}
                          className='w-full text-lg py-6 px-4 justify-between'
                          value={day}>
                          <p>{day.charAt(0).toUpperCase() + day.slice(1)}</p>
                          <p>8:00AM - 5:00PM</p>
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FormControl>
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
            <FormField
              control={form.control}
              name='customerName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='customerContact'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Contact Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className='flex w-full items-center gap-2 lg:justify-center'>
              <Button className='w-full' disabled={isLoading}>
                {isLoading && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                Add Ticket
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
