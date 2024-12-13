import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@root/components/ui/card';
import { cn } from '@root/lib/utils/utils';
import { Task } from '@root/lib/types/common';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import SwimlaneTask from './SwimlaneTask';

interface SwimlaneProps {
  title: string;
  data: Task[];
}

const Swimlane: React.FC<
  SwimlaneProps & React.ComponentPropsWithRef<'div'>
> = ({ data, title, ...props }) => (
  <Card
    {...props}
    className={cn(
      'w-full h-full flex flex-col',
      // eslint-disable-next-line react/prop-types
      props.className ?? ''
    )}
  >
    <CardHeader className="p-2 px-2.5 flex flex-row gap-2 items-center justify-between">
      <CardTitle className="text-slate-500 text-xs font-semibold">
        {title.toLocaleUpperCase()}
      </CardTitle>
      <div className="flex gap-2 items-center !m-0">
        <Button variant="outline" className="p-1 !py-1 h-fit">
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </CardHeader>
    <CardContent className="p-2 pr-2 flex flex-col items-center gap-2 h-full pb-8">
      {data?.length ? (
        data.map((task) => (
          <SwimlaneTask
            key={task.id}
            data={task}
            mask={{ status: false, dayOfTheWeek: false }}
          />
        ))
      ) : (
        <div className="p-4 text-slate-500">No Tasks.</div>
      )}
    </CardContent>
  </Card>
);

export default Swimlane;
