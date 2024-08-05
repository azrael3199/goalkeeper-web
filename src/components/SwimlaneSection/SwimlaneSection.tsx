import React from 'react';
import Swimlane from './Swimlane';
import SwimlaneTask from './SwimlaneTask';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SwimlaneSectionProps {}

const SwimlaneSection: React.FC<SwimlaneSectionProps> = () => {
  const swimlaneData = [
    // TODO: Replace with actual data
    {
      title: 'To Do',
      tasks: [
        {
          taskId: '1',
          title: 'Run 5 miles',
          description: 'Go out to run 5 miles',
          // parentId?: string;
          priority: 1,
          hoursRequired: 3,
          hoursSpent: 2,
        },
        {
          taskId: '2',
          title: 'Clean 10 dishes',
          description: 'Clean 10 dishes',
          // parentId?: string;
          priority: 4,
          hoursRequired: 3,
          hoursSpent: 2,
        },
        {
          taskId: '5',
          title: 'Do the laundry',
          description: 'Do the laundry',
          // parentId?: string;
          priority: 5,
          hoursRequired: 3,
          hoursSpent: 2,
        },
      ],
    },
    {
      title: 'In Progress',
      tasks: [
        {
          taskId: '3',
          title: 'Read a book',
          description: 'Read 15 pages',
          // parentId?: string;
          priority: 3,
          hoursRequired: 3,
          hoursSpent: 2,
        },
      ],
    },
    {
      title: 'In Review',
      tasks: [
        {
          taskId: '4',
          title: 'Meditate',
          description: 'Meditate for 10 minutes',
          // parentId?: string;
          priority: 2,
          hoursRequired: 3,
          hoursSpent: 2,
        },
      ],
    },
    {
      title: 'Done',
      tasks: [],
    },
  ];

  return (
    <section
      className="p-2 py-4 h-full flex flex-col md:grid gap-3"
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
            <SwimlaneTask key={task.taskId} {...task} />
          ))}
        </Swimlane>
      ))}
    </section>
  );
};

export default SwimlaneSection;
