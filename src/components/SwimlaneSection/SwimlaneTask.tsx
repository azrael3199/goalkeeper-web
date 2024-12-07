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
import { goalData } from '@root/lib/utils/dummies';
import { Ellipsis, Check, Trash } from 'lucide-react';
import { Task } from '@root/lib/redux/reducers/tasksReducer';
import { Badge } from '../ui/badge';

export type Mask = {
  taskId?: boolean;
  title?: boolean;
  description?: boolean;
  parentId?: boolean;
  priority?: boolean;
  hoursRequired?: boolean;
  hoursSpent?: boolean;
  status?: boolean;
};

interface SwimlaneTaskProps {
  data: Task;
  mask?: Mask;
}

const PRIORITY_VALUES = [
  { background: 'bg-red-800', text: 'text-black', value: 'High' },
  { background: 'bg-yellow-500', text: 'text-black', value: 'Medium' },
  { background: 'bg-green-500', text: 'text-black', value: 'Low' },
];

const STATUS_VALUES = {
  TODO: {
    background: 'bg-orange-400',
    text: 'text-orange-900',
    value: 'To Do',
  },
  IN_PROGRESS: {
    background: 'bg-blue-400',
    text: 'text-blue-900',
    value: 'In Progress',
  },
  DONE: {
    background: 'bg-green-400',
    text: 'text-green-900',
    value: 'Done',
  },
};

const SwimlaneTask: React.FC<
  SwimlaneTaskProps & React.ComponentPropsWithRef<'div'>
> = ({ data, mask, ...props }) => {
  const DEFAULT_MASK: Mask = {
    taskId: true,
    title: true,
    description: true,
    parentId: true,
    priority: true,
    hoursRequired: true,
    status: true,
  };

  // To replace the default mask with values from mask
  const newMask = { ...DEFAULT_MASK, ...mask };

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
      <CardHeader className="p-2 pb-0">
        <section className="grid grid-cols-2 items-start gap-2">
          {/* Task title, id and actions */}
          <CardTitle className="text-xs text-white font-normal">
            {newMask.title && data.title}
            <em className="text-[12px] text-muted-foreground px-2">{`#${
              newMask.taskId && data.id
            }`}</em>
          </CardTitle>
          {data.status !== 'DONE' && (
            <div className="text-xs flex md:invisible md:group-hover: md:group-hover:visible items-center justify-self-end justify-center gap-2">
              <Ellipsis className="hover:cursor-pointer" size={18} />
              <Trash className="text-red-500 hover:cursor-pointer" size={18} />
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
        <Badge className="bg-slate-800 hover:bg-slate-800 rounded-full min-h-6 px-2 text-center text-xs justify-self-end">
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
        {data.status && newMask.status ? (
          <Badge
            className={`${STATUS_VALUES[data.status].background} hover:${
              STATUS_VALUES[data.status].background
            } ${
              STATUS_VALUES[data.status].text
            } min-h-6 uppercase text-center justify-self-end`}
          >
            {STATUS_VALUES[data.status].value}
          </Badge>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default SwimlaneTask;
