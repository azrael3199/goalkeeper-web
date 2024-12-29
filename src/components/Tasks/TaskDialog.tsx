import React, { useState } from 'react';
import { Check, Edit2 } from 'lucide-react';
import { z } from 'zod';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import uuidv4 from 'uuidv4';
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
import { useDialog } from '@root/providers/DialogProvider';
import { useAppDispatch } from '@root/lib/redux/store';
import { addTask, updateTask } from '@root/lib/redux/reducers/tasksReducer';
import { DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import DateTimePicker from '../ui/date-time-picker';
import { Label } from '../ui/label';

interface TaskDialogProps {
  id?: string;
  data?: Task;
}

const FormSchema = z
  .object({
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
    hoursRequired: z
      .number({ required_error: 'Hours required is required' })
      .min(0.5, 'Hours required must be at least 0.5')
      .max(23, 'Hours required must not exceed 23'),
  })
  .superRefine((data, ctx) => {
    const date = new Date(data.dateAndTime);
    if (Number.isNaN(date.getTime())) {
      return; // Skip further checks if dateAndTime is invalid
    }

    const endDateTime = new Date(date);
    endDateTime.setHours(endDateTime.getHours() + data.hoursRequired);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999); // Last millisecond of the same day

    if (endDateTime > endOfDay) {
      ctx.addIssue({
        code: 'custom',
        path: ['hoursRequired'], // Indicate this field as the source of the error
        message: 'The task duration exceeds the end of the day',
      });
    }
  });

const TaskDialog = ({ id, data }: TaskDialogProps) => {
  let d = null;

  if (!data) {
    d = {
      id: 'new',
      title: '',
      description: '',
      parentId: '',
      dateAndTime: '',
      priority: 3,
      hoursRequired: 0.5,
      status: 'NOT_STARTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {},
    };
  } else {
    d = {
      ...data,
    };
  }

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: d.title || '',
      description: d.description || '',
      parentId: d.parentId || '',
      dateAndTime: d.dateAndTime || new Date().toISOString(),
      priority: d.priority || 3,
      hoursRequired: d.hoursRequired || 0.5,
    },
  });

  const dispatch = useAppDispatch();

  const { closeDialog } = useDialog();

  const [isGoalPickerOpen, setGoalPickerOpen] = useState(false);
  const [isPriorityPickerOpen, setPriorityPickerOpen] = useState(false);

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    // Simulate a server call with a fake promise that resolves after 3 seconds
    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });

    if (id) {
      // If there's an id, update the existing task
      // @ts-expect-error status is a string
      dispatch(updateTask({ id, ...d, ...formData }));
    } else {
      // Else add a new task
      // @ts-expect-error status is a string
      dispatch(addTask({ id: uuidv4(), ...d, ...formData }));
    }
    closeDialog();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle>{data ? 'Edit' : 'Create'} task</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          <FormItem className="space-y-0 col-span-4 grid grid-cols-4 items-center gap-4">
            <FormLabel htmlFor="name" className="text-right">
              Task Name
            </FormLabel>
            <FormControl className="col-span-3">
              <Input id="name" {...form.register('title')} />
            </FormControl>
            {form.formState.errors?.title && <div />}
            <FormMessage className="col-span-4">
              {form.formState.errors?.title?.message}
            </FormMessage>
          </FormItem>
          <FormItem className="space-y-0 col-span-4 grid grid-cols-4 items-center gap-4">
            <FormLabel htmlFor="description" className="text-right">
              Description
            </FormLabel>
            <FormControl className="col-span-3">
              <Input id="description" {...form.register('description')} />
            </FormControl>
            {form.formState.errors?.description && <div />}
            <FormMessage className="col-span-4">
              {form.formState.errors?.description?.message}
            </FormMessage>
          </FormItem>
          <FormItem className="space-y-0 col-span-4 grid grid-cols-4 items-center gap-4">
            <FormLabel htmlFor="hoursRequired" className="text-right">
              Hours Required
            </FormLabel>
            <FormControl
              id="hoursRequired"
              className="col-span-3"
              {...form.register('hoursRequired', {
                setValueAs: (value) => Number.parseFloat(value),
              })}
            >
              <Input
                type="number"
                id="quantity"
                defaultValue="0.5"
                min="0.5"
                max="23"
                step="0.5"
              />
            </FormControl>
            {form.formState.errors?.hoursRequired && <div />}
            <FormMessage className="col-span-3">
              {form.formState.errors?.hoursRequired?.message}
            </FormMessage>
          </FormItem>
          <FormItem className="space-y-0 col-span-4 grid grid-cols-4 items-center gap-4">
            <FormLabel htmlFor="parent" className="text-right">
              Parent Goal
            </FormLabel>
            <FormControl
              {...form.register('parentId', {
                setValueAs: (value) => value.toString(), // convert the value to a string
              })}
            >
              <Popover open={isGoalPickerOpen} onOpenChange={setGoalPickerOpen}>
                <div className="col-span-3">
                  <PopoverTrigger>
                    <div className="flex items-center gap-2">
                      {form.watch('parentId')?.length ? (
                        <Badge
                          className="min-h-6 px-2"
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
                      ) : (
                        <Badge className="min-h-6 max-w-full px-2 bg-accent text-foreground hover:bg-accent">
                          <div className="!truncate">None</div>
                        </Badge>
                      )}
                      <Edit2 className="h-4 w-4" />
                    </div>
                  </PopoverTrigger>
                </div>
                <PopoverContent
                  className="max-h-54 w-fit overflow-y-auto py-2 px-1"
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  container={
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    document.getElementById(`task-form-${id || 'new'}`)!
                  }
                >
                  <ul
                    id="parent-goal-selection"
                    className="flex flex-col w-full"
                  >
                    {/* eslint-disable-next-line max-len */}
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
                    <li
                      key="none"
                      className={cn(
                        'w-full cursor-pointer hover:bg-secondary py-1 px-2 grid grid-cols-5 items-center gap-2 rounded-md'
                      )}
                      onClick={() => {
                        form.setValue('parentId', '', {
                          shouldDirty: true,
                          shouldTouch: true,
                        });
                        form.trigger('parentId');
                        setGoalPickerOpen(false);
                      }}
                    >
                      <div className="space-y-0 col-span-4">
                        <Badge className="min-h-6 max-w-full px-2 bg-accent text-foreground hover:bg-accent">
                          <div className="!truncate">None</div>
                        </Badge>
                      </div>
                      {form.watch('parentId') === '' && (
                        <Check className="h-4 w-4 text-green-500 justify-self-end" />
                      )}
                    </li>
                    {goalData.map((goal) => (
                      // eslint-disable-next-line max-len
                      // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                      <li
                        key={goal.id}
                        className={cn(
                          'w-full cursor-pointer hover:bg-secondary py-1 px-2 grid grid-cols-5 items-center gap-2 rounded-md'
                        )}
                        onClick={() => {
                          form.setValue('parentId', goal.id, {
                            shouldDirty: true,
                            shouldTouch: true,
                          });
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
            {form.formState.errors?.parentId && <div />}
            <FormMessage className="col-span-4">
              {form.formState.errors?.parentId?.message}
            </FormMessage>
          </FormItem>
          <FormItem className="space-y-0 col-span-4 grid grid-cols-4 items-center gap-4">
            <FormLabel htmlFor="priority" className="text-right">
              Priority
            </FormLabel>
            <FormControl
              {...form.register('priority', {
                setValueAs: (value) => Number(value), // convert the value to a number
              })}
            >
              <Popover
                open={isPriorityPickerOpen}
                onOpenChange={setPriorityPickerOpen}
              >
                <div className="col-span-3">
                  <PopoverTrigger className="col-span-3">
                    <div className="flex items-center w-fit gap-2">
                      <Badge
                        className={cn(
                          'min-h-6 px-2',
                          PRIORITY_VALUES[form.watch('priority') - 1]
                            ?.background,
                          `hover:${PRIORITY_VALUES[d.priority - 1].background}`,
                          PRIORITY_VALUES[form.watch('priority') - 1]?.text ??
                            'text-[#FFFFFF]'
                        )}
                      >
                        <div className="!truncate text-center">
                          {PRIORITY_VALUES[form.watch('priority') - 1]?.value}
                        </div>
                      </Badge>
                      <Edit2 className="h-4 w-4" />
                    </div>
                  </PopoverTrigger>
                </div>
                <PopoverContent
                  className="max-h-54 w-fit overflow-y-auto py-2 px-1"
                  container={
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    document.getElementById(`task-form-${id || 'new'}`)!
                  }
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
                          form.setValue('priority', index + 1, {
                            shouldDirty: true,
                            shouldTouch: true,
                          });
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
            {form.formState.errors?.priority && <div />}
            <FormMessage className="col-span-4">
              {form.formState.errors?.priority?.message}
            </FormMessage>
          </FormItem>
          <FormItem className="space-y-0 col-span-4 grid grid-cols-4 items-center gap-4">
            <FormLabel htmlFor="date" className="text-right">
              Date & Time
            </FormLabel>
            <DateTimePicker
              selectedDateTime={form.watch('dateAndTime')}
              onChange={(date) =>
                form.setValue('dateAndTime', date, {
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
              containerId={`task-form-${id || 'new'}`}
            />
            {form.formState.errors?.dateAndTime && <div />}
            <FormMessage className="col-span-4">
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
              {format(new Date(d.createdAt), 'PPPp')}
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
              {format(new Date(d.updatedAt), 'PPPp')}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={
              form.formState.isSubmitting ||
              !Object.values(form.formState.errors).every(
                (error) => !error.message?.length
              ) ||
              !form.formState.isDirty
            }
            type="submit"
          >
            {form.formState.isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default TaskDialog;
