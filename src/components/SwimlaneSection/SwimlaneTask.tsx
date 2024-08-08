import React from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@root/components/ui/card';
import { cn } from '@root/lib/utils/utils';
import { Badge } from '../ui/badge';

interface SwimlaneTaskProps {
  taskId: string;
  title: string;
  description?: string;
  parentId?: string;
  priority?: number;
  hoursRequired?: number;
  hoursSpent?: number;
}

const PRIORITY_VALUES = [
  { background: 'bg-red-800', text: 'text-white', value: 'Highest' },
  { background: 'bg-orange-500', text: 'text-black', value: 'High' },
  { background: 'bg-yellow-500', text: 'text-black', value: 'Medium' },
  { background: 'bg-lime-500', text: 'text-black', value: 'Low' },
  { background: 'bg-green-500', text: 'text-black', value: 'Lowest' },
];

const SwimlaneTask: React.FC<
  SwimlaneTaskProps & React.ComponentPropsWithRef<'div'>
> = ({
  taskId,
  title,
  description,
  parentId,
  priority,
  hoursRequired,
  hoursSpent,
  ...props
}) => (
  // eslint-disable-next-line react/prop-types
  <Card {...props} className={cn('bg-secondary w-full', props.className)}>
    <CardHeader className="p-2">
      <section className="flex justify-between gap-2">
        <CardTitle className="text-sm text-white font-normal">
          {title}
        </CardTitle>
        <em className="text-[10px] text-muted-foreground pr-2">{`#${taskId}`}</em>
      </section>
      <div className="flex justify-between items-stretch gap-2">
        <div className="h-full items-start">
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <div className="flex gap-2 justify-center items-center md:flex-col text-xs">
          <h1 className="bg-slate-800 rounded-full p-1 px-2 text-center">
            {hoursSpent} / {hoursRequired} hrs
          </h1>
          {priority && (
            <Badge
              className={`${PRIORITY_VALUES[priority - 1].background} hover:${
                PRIORITY_VALUES[priority - 1].background
              } ${PRIORITY_VALUES[priority - 1].text} h-6`}
            >
              {PRIORITY_VALUES[priority - 1].value}
            </Badge>
          )}
        </div>
      </div>
    </CardHeader>
  </Card>
);

export default SwimlaneTask;
