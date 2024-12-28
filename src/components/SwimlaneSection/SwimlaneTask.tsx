'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@root/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@root/components/ui/tooltip';
import { cn, getContrastForColorInBW } from '@root/lib/utils/utils';
import { goalData, PRIORITY_VALUES } from '@root/lib/utils/dummies';
import { Ellipsis, Check, Trash, Edit2 } from 'lucide-react';
import { useDialog } from '@root/providers/DialogProvider';
import { Task, Weekday } from '@root/lib/types/common';
import { Badge } from '../ui/badge';
import TaskDialog from '../Tasks/TaskDialog';
import { Button } from '../ui/button';

export type Mask = {
  taskId?: boolean;
  title?: boolean;
  description?: boolean;
  parentId?: boolean;
  priority?: boolean;
  hoursRequired?: boolean;
  hoursSpent?: boolean;
  status?: boolean;
  dayOfTheWeek?: boolean;
};

interface SwimlaneTaskProps {
  data: Task;
  mask?: Mask;
}

// const STATUS_VALUES = {
//   NOT_STARTED: {
//     background: 'bg-orange-400',
//     text: 'text-orange-900',
//     value: 'To Do',
//   },
//   IN_PROGRESS: {
//     background: 'bg-blue-400',
//     text: 'text-blue-900',
//     value: 'In Progress',
//   },
//   DONE: {
//     background: 'bg-green-400',
//     text: 'text-green-900',
//     value: 'Done',
//   },
// };

const DAY_OF_THE_WEEK_VALUES = {
  MON: 'Monday',
  TUE: 'Tuesday',
  WED: 'Wednesday',
  THU: 'Thursday',
  FRI: 'Friday',
  SAT: 'Saturday',
  SUN: 'Sunday',
};

const DEFAULT_MASK: Mask = {
  taskId: true,
  title: true,
  description: true,
  parentId: true,
  priority: true,
  hoursRequired: true,
  status: true,
  dayOfTheWeek: true,
};

const SwimlaneTask: React.FC<
  SwimlaneTaskProps & React.ComponentPropsWithRef<'div'>
> = ({ data, mask, ...props }) => {
  const { openDialog } = useDialog();

  // To replace the default mask with values from mask
  const newMask = { ...DEFAULT_MASK, ...mask };

  const weekday = new Date(data.dateAndTime)
    .toLocaleDateString('en-US', { weekday: 'short' })
    .toUpperCase();

  return (
    <Card
      {...props}
      className={cn(
        'group relative bg-secondary w-full hover:cursor-pointer',
        { 'border-0': data.status === 'DONE' },
        // eslint-disable-next-line react/prop-types
        props.className
      )}
    >
      {data.status === 'DONE' && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center">
          <Check className="text-green-500" size={32} />
        </div>
      )}
      <CardHeader className="p-2 pb-1">
        <section className="grid grid-cols-2 items-start gap-2">
          {/* Task title, id and actions */}
          <CardTitle className="text-xs text-white font-normal">
            {newMask.title && data.title}
            <em className="text-[12px] text-muted-foreground px-2">{`#${
              newMask.taskId && data.id
            }`}</em>
          </CardTitle>
          {data.status !== 'DONE' && (
            <div className="text-xs flex md:invisible md:group-hover: md:group-hover:visible items-center justify-self-end justify-center gap-1">
              <Button
                variant="ghost"
                className="p-0 hover:bg-transparent h-fit w-fit"
              >
                <Ellipsis className="hover:cursor-pointer" size={14} />
              </Button>
              <Button
                variant="ghost"
                className="p-0 hover:bg-transparent h-fit w-fit"
              >
                <Edit2
                  className="hover:cursor-pointer"
                  size={14}
                  onClick={() =>
                    openDialog(
                      <TaskDialog id={data.id} data={data} />,
                      `task-form-${data.id}`
                    )
                  }
                />
              </Button>
              <Button
                variant="ghost"
                className="p-0 hover:bg-transparent h-fit w-fit"
              >
                <Trash
                  className="text-destructive hover:cursor-pointer"
                  size={14}
                />
              </Button>
            </div>
          )}
        </section>
      </CardHeader>
      <CardContent className="!text-xs grid grid-cols-2 gap-2 p-2 pt-1 items-start justify-items-start">
        {/* Description */}
        {data.description && newMask.description ? (
          <CardDescription className="!text-xs">
            {data.description}
          </CardDescription>
        ) : null}
        {/* Effort estimation and tracking */}
        <Badge className="bg-accent hover:bg-accent rounded-full min-h-6 px-2 text-center text-xs justify-self-end">
          {data.hoursRequired && newMask.hoursRequired
            ? `${data.hoursRequired} hrs`
            : null}
        </Badge>
        {/* Parent goal name */}
        {data.parentId && newMask.parentId ? (
          <Tooltip>
            <TooltipTrigger className="max-w-full">
              <Badge
                className="min-h-6 max-w-full px-2"
                style={{
                  backgroundColor: goalData.find(
                    (goal) => goal.id === data.parentId
                  )?.overlayColor,
                  color: getContrastForColorInBW(
                    goalData.find((goal) => goal.id === data.parentId)
                      ?.overlayColor || '#FFFFFF'
                  ),
                }}
              >
                <div className="!truncate">
                  {goalData.find((goal) => goal.id === data.parentId)?.title}
                </div>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="bg-background rounded-md shadow-md">
                {goalData.find((goal) => goal.id === data.parentId)?.title}
              </div>
            </TooltipContent>
          </Tooltip>
        ) : null}
        {/* Priority */}
        {data.priority && newMask.priority ? (
          <Badge
            className={`${
              PRIORITY_VALUES[data.priority - 1].background
            } hover:${PRIORITY_VALUES[data.priority - 1].background} ${
              PRIORITY_VALUES[data.priority - 1].text
            } min-h-6 text-center justify-self-end`}
          >
            {PRIORITY_VALUES[data.priority - 1].value}
          </Badge>
        ) : null}
        {/* Status */}
        {data.dateAndTime && newMask.dayOfTheWeek ? (
          <Badge className="bg-accent hover:bg-accent text-white min-h-6 text-center justify-self-end">
            {DAY_OF_THE_WEEK_VALUES[weekday as Weekday]}
          </Badge>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default SwimlaneTask;
