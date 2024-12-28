import React, { useState } from 'react';
import { CalendarIcon, Check, Edit2 } from 'lucide-react';
import { z } from 'zod';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Task } from '@root/lib/types/common';
import { goalData, PRIORITY_VALUES } from '@root/lib/utils/dummies';
import { cn, getContrastForColorInBW } from '@root/lib/utils/utils';
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@root/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@root/components/ui/popover';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import { Label } from '../ui/label';

interface TaskDialogProps {
  id: string;
  data: Task;
  isEditing?: boolean;
}

const FormSchema = z.object({
  title: z
    .string()
    .min(3, 'Task name is required and must have minimum 3 characters'),
  description: z.string().optional(),
  parentId: z.string().optional(),
  dateAndTime: z.string({ required_error: 'Date & Time is required' }).refine(
    (value) => !Number.isNaN(Date.parse(value)), // Ensure it can be parsed into a valid Date
    {
      message: 'Invalid date & time',
    }
  ),
  priority: z.number({ required_error: 'Priority is required' }),
});

const TaskDialog = ({ id, data, isEditing = true }: TaskDialogProps) => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: data.title,
      description: data.description,
      parentId: data.parentId,
      dateAndTime: data.dateAndTime,
      priority: data.priority,
    },
  });

  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [isGoalPickerOpen, setGoalPickerOpen] = useState(false);
  const [isPriorityPickerOpen, setPriorityPickerOpen] = useState(false);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleTimeChange = (
    date: string,
    type: 'hour' | 'minute' | 'ampm',
    value: string
  ): string => {
    let newDate = new Date();
    if (date) {
      newDate = new Date(date);
    }
    if (type === 'hour') {
      newDate.setHours(
        (Number.parseInt(value, 10) % 12) + (newDate.getHours() >= 12 ? 12 : 0)
      );
    } else if (type === 'minute') {
      newDate.setMinutes(Number.parseInt(value, 10));
    } else if (type === 'ampm') {
      const currentHours = newDate.getHours();
      newDate.setHours(value === 'PM' ? currentHours + 12 : currentHours - 12);
    }
    return newDate.toISOString();
  };

  const onSubmit = (formData: any) => {
    // Handle form submission
    // const dateAndTime = mergeDateAndTime(formData.date, formData.time);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'Create'} task</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          <FormItem className="space-y-0 col-span-4 grid grid-cols-4 items-center gap-4">
            <FormLabel htmlFor="name" className="text-right">
              Task Name
            </FormLabel>
            <FormControl className="col-span-3">
              <Input id="name" {...form.register('title')} />
            </FormControl>
            <FormMessage>{form.formState.errors?.title?.message}</FormMessage>
          </FormItem>
          <FormItem className="space-y-0 col-span-4 grid grid-cols-4 items-center gap-4">
            <FormLabel htmlFor="description" className="text-right">
              Description
            </FormLabel>
            <FormControl className="col-span-3">
              <Input id="description" {...form.register('description')} />
            </FormControl>
            <FormMessage>
              {form.formState.errors?.description?.message}
            </FormMessage>
          </FormItem>
          <FormItem className="space-y-0 col-span-4 grid grid-cols-4 items-center gap-4">
            <FormLabel htmlFor="parent" className="text-right">
              Parent Goal
            </FormLabel>
            <FormControl className="col-span-3">
              <Popover open={isGoalPickerOpen} onOpenChange={setGoalPickerOpen}>
                <PopoverTrigger>
                  <div className="flex items-center w-full gap-2">
                    <Badge
                      className="min-h-6 grow px-2"
                      style={{
                        backgroundColor: goalData.find(
                          (goal) => goal.id === form.watch('parentId')
                        )?.overlayColor,
                        color: getContrastForColorInBW(
                          goalData.find(
                            (goal) => goal.id === form.watch('parentId')
                          )?.overlayColor || '#FFFFFF'
                        ),
                      }}
                    >
                      <div className="!truncate">
                        {
                          goalData.find(
                            (goal) => goal.id === form.watch('parentId')
                          )?.title
                        }
                      </div>
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-fit w-fit p-1 hover:bg-transparent"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="max-h-54 w-fit overflow-y-auto py-2 px-1"
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  container={document.getElementById(`task-form-${id}`)!}
                >
                  <ul
                    id="parent-goal-selection"
                    className="flex flex-col w-full"
                  >
                    {goalData.map((goal) => (
                      // eslint-disable-next-line max-len
                      // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                      <li
                        key={goal.id}
                        className={cn(
                          'w-full cursor-pointer hover:bg-secondary py-1 px-2 grid grid-cols-5 items-center gap-2 rounded-md'
                        )}
                        onClick={() => {
                          form.setValue('parentId', goal.id);
                          form.trigger('parentId');
                          setGoalPickerOpen(false);
                        }}
                      >
                        <div className="space-y-0 col-span-4">
                          <Badge
                            className="min-h-6 max-w-full px-2"
                            style={{
                              backgroundColor: goal.overlayColor,
                              color: getContrastForColorInBW(
                                goal.overlayColor || '#FFFFFF'
                              ),
                            }}
                          >
                            <div className="!truncate">{goal.title}</div>
                          </Badge>
                        </div>
                        {form.watch('parentId') === goal.id && (
                          <Check className="h-4 w-4 text-green-500 justify-self-end" />
                        )}
                      </li>
                    ))}
                  </ul>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage>
              {form.formState.errors?.parentId?.message}
            </FormMessage>
          </FormItem>
          {/* TODO: Add Priority */}
          <FormItem className="space-y-0 col-span-4 grid grid-cols-4 items-center gap-4">
            <FormLabel htmlFor="priority" className="text-right">
              Priority
            </FormLabel>
            <FormControl className="col-span-3">
              <Popover
                open={isPriorityPickerOpen}
                onOpenChange={setPriorityPickerOpen}
              >
                <PopoverTrigger>
                  <div className="flex items-center w-fit gap-2">
                    <Badge
                      className={cn(
                        'min-h-6 grow px-2',
                        PRIORITY_VALUES[form.watch('priority') - 1]?.background,
                        `hover:${
                          PRIORITY_VALUES[data.priority - 1].background
                        }`,
                        PRIORITY_VALUES[form.watch('priority') - 1]?.text ??
                          'text-[#FFFFFF]'
                      )}
                    >
                      <div className="!truncate text-center">
                        {PRIORITY_VALUES[form.watch('priority') - 1]?.value}
                      </div>
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-fit w-fit p-1 hover:bg-transparent"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="max-h-54 w-fit overflow-y-auto py-2 px-1"
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  container={document.getElementById(`task-form-${id}`)!}
                >
                  <ul id="priority-selection" className="flex flex-col w-full">
                    {PRIORITY_VALUES.map((priority, index) => (
                      // eslint-disable-next-line max-len
                      // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                      <li
                        key={priority.value}
                        className={cn(
                          'w-full cursor-pointer hover:bg-secondary py-1 px-2 grid grid-cols-5 items-center gap-2 rounded-md'
                        )}
                        onClick={() => {
                          form.setValue('priority', index + 1);
                          form.trigger('priority');
                          setPriorityPickerOpen(false);
                        }}
                      >
                        <div className="space-y-0 col-span-4">
                          <Badge
                            className={cn(
                              'min-h-6 max-w-full px-2',
                              priority.background,
                              `hover:${priority.background}`,
                              priority.text ?? 'text-[#FFFFFF]'
                            )}
                          >
                            <div className="!truncate">{priority.value}</div>
                          </Badge>
                        </div>
                        {form.watch('priority') - 1 === index && (
                          <Check className="h-4 w-4 text-green-500 justify-self-end" />
                        )}
                      </li>
                    ))}
                  </ul>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage>
              {form.formState.errors?.priority?.message}
            </FormMessage>
          </FormItem>
          <FormItem className="space-y-0 col-span-4 grid grid-cols-4 items-center gap-4">
            <FormLabel htmlFor="date" className="text-right">
              Date & Time
            </FormLabel>
            <Popover open={isDatePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-fit text-left font-normal',
                      !form.watch('dateAndTime') && 'text-muted-foreground'
                    )}
                  >
                    {form.watch('dateAndTime') ? (
                      <span className="whitespace-nowrap mr-3">
                        {format(form.watch('dateAndTime'), 'PPP hh:mm a')}
                      </span>
                    ) : (
                      <span>Pick a date & time</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="start" // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                container={document.getElementById(`task-form-${id}`)!}
              >
                {/* <Calendar
                  mode="single"
                  selected={new Date(form.watch('date') || data.dateAndTime)}
                  onSelect={(day, selectedDay) => {
                    form.setValue('date', selectedDay.toISOString());
                    form.trigger('date');
                    setDatePickerOpen(false);
                  }}
                  disabled={(date) => date < new Date('1900-01-01')}
                  initialFocus
                /> */}
                <div className="sm:flex">
                  <Calendar
                    mode="single"
                    selected={
                      new Date(form.watch('dateAndTime') || data.dateAndTime)
                    }
                    onSelect={(day, selectedDay) => {
                      form.setValue('dateAndTime', selectedDay.toISOString());
                      form.trigger('dateAndTime');
                    }}
                    initialFocus
                  />
                  <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                    <ScrollArea className="w-64 sm:w-auto">
                      <div className="flex sm:flex-col p-2">
                        {hours.reverse().map((hour) => (
                          <Button
                            key={hour}
                            size="icon"
                            variant={
                              form.watch('dateAndTime') &&
                              new Date(form.watch('dateAndTime')).getHours() %
                                12 ===
                                hour % 12
                                ? 'default'
                                : 'ghost'
                            }
                            className="sm:w-full shrink-0 aspect-square"
                            onClick={() => {
                              const newDate = handleTimeChange(
                                form.watch('dateAndTime'),
                                'hour',
                                hour.toString()
                              );
                              form.setValue('dateAndTime', newDate);
                              form.trigger('dateAndTime');
                            }}
                          >
                            {hour}
                          </Button>
                        ))}
                      </div>
                      <ScrollBar
                        orientation="horizontal"
                        className="sm:hidden"
                      />
                    </ScrollArea>
                    <ScrollArea className="w-64 sm:w-auto">
                      <div className="flex sm:flex-col p-2">
                        {Array.from({ length: 12 }, (_, i) => i * 5).map(
                          (minute) => (
                            <Button
                              key={minute}
                              size="icon"
                              variant={
                                form.watch('dateAndTime') &&
                                new Date(
                                  form.watch('dateAndTime')
                                ).getMinutes() === minute
                                  ? 'default'
                                  : 'ghost'
                              }
                              className="sm:w-full shrink-0 aspect-square"
                              onClick={() => {
                                const newDate = handleTimeChange(
                                  form.watch('dateAndTime'),
                                  'minute',
                                  minute.toString()
                                );
                                form.setValue('dateAndTime', newDate);
                                form.trigger('dateAndTime');
                              }}
                            >
                              {minute}
                            </Button>
                          )
                        )}
                      </div>
                      <ScrollBar
                        orientation="horizontal"
                        className="sm:hidden"
                      />
                    </ScrollArea>
                    <ScrollArea className="">
                      <div className="flex sm:flex-col p-2">
                        {['AM', 'PM'].map((ampm) => (
                          <Button
                            key={ampm}
                            size="icon"
                            variant={
                              form.watch('dateAndTime') &&
                              ((ampm === 'AM' &&
                                new Date(form.watch('dateAndTime')).getHours() <
                                  12) ||
                                (ampm === 'PM' &&
                                  new Date(
                                    form.watch('dateAndTime')
                                  ).getHours() >= 12))
                                ? 'default'
                                : 'ghost'
                            }
                            className="sm:w-full shrink-0 aspect-square"
                            onClick={() => {
                              const newDate = handleTimeChange(
                                form.watch('dateAndTime'),
                                'ampm',
                                ampm
                              );
                              form.setValue('dateAndTime', newDate);
                              form.trigger('dateAndTime');
                            }}
                          >
                            {ampm}
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <FormMessage>
              {form.formState.errors?.dateAndTime?.message}
            </FormMessage>
          </FormItem>
          <div className="space-y-0 col-span-4 grid grid-cols-4 items-center gap-4">
            <Label htmlFor="createdAt" className="text-right">
              Created At
            </Label>
            <p
              id="createdAt"
              className="text-muted-foreground max-w-full col-span-3 text-sm"
            >
              {format(new Date(data.createdAt), 'PPPp')}
            </p>
          </div>
          <div className="space-y-0 col-span-4 grid grid-cols-4 items-center gap-4">
            <Label htmlFor="updatedAt" className="text-right">
              Modified At
            </Label>
            <p
              id="updatedAt"
              className="text-muted-foreground col-span-3 text-sm"
            >
              {format(new Date(data.updatedAt), 'PPPp')}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default TaskDialog;
