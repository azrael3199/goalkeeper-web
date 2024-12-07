import React from 'react';
import { Task } from '@root/lib/redux/reducers/tasksReducer';
import SwimlaneTask from './SwimlaneTask';

type PriorityGroupingProps = {
  title: 'High' | 'Medium' | 'Low';
  data: Task[];
};

const PriorityGrouping = ({ title, data }: PriorityGroupingProps) => (
  <div className="w-full flex flex-col gap-1">
    <h3 className="text-slate-500 text-xs font-semibold uppercase border-border border-b pb-2">
      {title}
    </h3>
    <div className="p-2 flex flex-col gap-2">
      {data.map((task) => (
        <SwimlaneTask key={task.id} data={task} mask={{ priority: false }} />
      ))}
    </div>
  </div>
);

export default PriorityGrouping;
