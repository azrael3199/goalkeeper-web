import React from 'react';
import { Task } from '@root/lib/types/common';
import SwimlaneTask from './SwimlaneTask';

type PriorityGroupingProps = {
  title: 'High' | 'Medium' | 'Low';
  data: Task[];
};

const PriorityGrouping = ({ title, data }: PriorityGroupingProps) => (
  <div className="w-full flex flex-col gap-1">
    <h3 className="text-foreground text-xs font-semibold uppercase border-border border-b pb-2">
      {title}
    </h3>
    <div className="p-2 flex flex-col gap-2">
      {data.length === 0 && (
        <p className="text-gray-400 text-md text-center lg:text-left">
          No tasks found
        </p>
      )}
      {data
        .sort(
          (a, b) =>
            new Date(a.dateAndTime).getTime() -
            new Date(b.dateAndTime).getTime()
        )
        .map((task) => (
          <SwimlaneTask
            key={task.id}
            data={task}
            mask={{ priority: false, status: false }}
          />
        ))}
    </div>
  </div>
);

export default PriorityGrouping;
