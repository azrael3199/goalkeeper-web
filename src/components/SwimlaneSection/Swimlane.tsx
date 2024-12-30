import React from 'react';
import { Plus } from 'lucide-react';
import { startOfWeek } from 'date-fns';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@root/components/ui/card';
import { cn } from '@root/lib/utils/utils';
import { Task } from '@root/lib/types/common';
import { useDialog } from '@root/providers/DialogProvider';
import { Button } from '../ui/button';
import SwimlaneTask from './SwimlaneTask';
import TaskDialog from '../Tasks/TaskDialog';

interface SwimlaneProps {
  title: string;
  date: string;
  data: Task[];
}

const Swimlane: React.FC<
  SwimlaneProps & React.ComponentPropsWithRef<'div'>
> = ({ data, title, date, ...props }) => {
  const { openDialog } = useDialog();

  const weekStart = startOfWeek(new Date());
  const isPastWeek = new Date(date).getTime() < weekStart.getTime();

  return (
    <Card
      {...props}
      className={cn(
        'w-full h-full flex flex-col',
        // eslint-disable-next-line react/prop-types
        props.className ?? ''
      )}
    >
      <CardHeader className="p-2 px-2.5 flex flex-row gap-2 items-center justify-between">
        <CardTitle className="text-foreground text-xs font-semibold">
          {title.toLocaleUpperCase()}
        </CardTitle>
        <div className="flex gap-2 items-center !m-0">
          <Button
            variant="outline"
            className="p-1 !py-1 h-fit"
            disabled={isPastWeek}
            tooltip={
              isPastWeek ? 'Cannot add tasks in the past weeks' : 'Add Task'
            }
            onClick={() => openDialog(<TaskDialog />, 'task-form-new')}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-2 pr-2 flex flex-col items-center gap-2 h-full pb-8">
        {data?.length ? (
          data
            .sort(
              (a, b) =>
                new Date(a.dateAndTime).getTime() -
                new Date(b.dateAndTime).getTime()
            )
            .map((task) => (
              <SwimlaneTask
                key={task.id}
                data={task}
                mask={{ status: false, dayOfTheWeek: false }}
              />
            ))
        ) : (
          <div className="p-4 text-muted-foreground">No Tasks.</div>
        )}
      </CardContent>
    </Card>
  );
};

export default Swimlane;
