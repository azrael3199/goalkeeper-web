'use client';

import React, { useState } from 'react';
import { Columns, List } from 'lucide-react';
import clsx from 'clsx';
import {
  transformTasksByPriority,
  transformTasksByStatus,
} from '@root/lib/utils/transforms';
import { Task } from '@root/lib/redux/reducers/tasksReducer';
import Swimlane from './Swimlane';
import SwimlaneTask from './SwimlaneTask';
import SectionWrapper from '../SectionWrapper';
import { Button } from '../ui/button';
import PriorityList from './PriorityList';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SwimlaneSectionProps {}

const taskData: Task[] = [
  {
    id: '1',
    title: 'Run 5 miles',
    description: 'Go out to run 5 miles',
    // parentId?: string;
    priority: 1,
    hoursRequired: 3,
    hoursSpent: 2,
    status: 'TODO',
  },
  {
    id: '2',
    title: 'Clean 10 dishes',
    description: 'Clean 10 dishes',
    // parentId?: string;
    priority: 4,
    hoursRequired: 3,
    hoursSpent: 2,
    status: 'TODO',
  },
  {
    id: '5',
    title: 'Do the laundry',
    description: 'Do the laundry',
    // parentId?: string;
    priority: 5,
    hoursRequired: 3,
    hoursSpent: 2,
    status: 'TODO',
  },
  {
    id: '3',
    title: 'Read a book',
    description: 'Read 15 pages',
    // parentId?: string;
    priority: 3,
    hoursRequired: 3,
    hoursSpent: 2,
    status: 'IN_PROGRESS',
  },
  {
    id: '4',
    title: 'Meditate',
    description: 'Meditate for 10 minutes',
    // parentId?: string;
    priority: 2,
    hoursRequired: 3,
    hoursSpent: 2,
    status: 'DONE',
  },
];

const SwimlaneSection: React.FC<SwimlaneSectionProps> = () => {
  const [selectedLayout, setSelectedLayout] = useState<number>(1);
  const [data, setData] = useState<{ title: string; tasks: Task[] }[]>(() => {
    if (selectedLayout === 0) {
      return transformTasksByPriority(taskData);
    }
    return transformTasksByStatus(taskData);
  });

  const swimlaneData = transformTasksByStatus(taskData);

  const onViewToggle = (selectedIndex: number) => {
    setSelectedLayout(selectedIndex);
    if (selectedIndex === 0) {
      setData(transformTasksByPriority(taskData));
    } else {
      setData(transformTasksByStatus(taskData));
    }
  };

  return (
    <SectionWrapper
      title="This Week"
      actions={
        <>
          <Button
            variant="outline"
            className={clsx('p-2', { 'bg-slate-800': selectedLayout === 0 })}
            onClick={() => onViewToggle(0)}
          >
            <List className="w-5 w-aspect-1 h-aspect-1" />
          </Button>
          <Button
            variant="outline"
            className={clsx('p-2', { 'bg-slate-800': selectedLayout === 1 })}
            onClick={() => onViewToggle(1)}
          >
            <Columns className="w-5 w-aspect-1 h-aspect-1" />
          </Button>
        </>
      }
    >
      {selectedLayout === 0 ? (
        // @ts-expect-error Ignore the type error
        <PriorityList data={data} />
      ) : (
        <section
          className="p-2 py-1 flex flex-col md:grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${swimlaneData.length}, 1fr)`,
          }}
        >
          {swimlaneData.map((swimlane) => (
            <Swimlane
              key={swimlane.title}
              title={swimlane.title}
              className="lg:min-h-[375px]"
            >
              {swimlane.tasks.map((task) => (
                <SwimlaneTask
                  key={task.id}
                  data={task}
                  mask={{ status: false }}
                />
              ))}
            </Swimlane>
          ))}
        </section>
      )}
    </SectionWrapper>
  );
};

export default SwimlaneSection;
