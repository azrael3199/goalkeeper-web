import { Task } from '@root/lib/types/common';

export const transformTasksByStatus = (tasks: Task[]) => {
  const groupedTasks: { title: string; tasks: Task[] }[] = [
    {
      title: 'Sunday',
      tasks: [],
    },
    {
      title: 'Monday',
      tasks: [],
    },
    {
      title: 'Tuesday',
      tasks: [],
    },
    {
      title: 'Wednesday',
      tasks: [],
    },
    {
      title: 'Thursday',
      tasks: [],
    },
    {
      title: 'Friday',
      tasks: [],
    },
    {
      title: 'Saturday',
      tasks: [],
    },
  ];

  tasks.forEach((task) => {
    const dayIndex = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].indexOf(
      task.dayOfTheWeek
    );
    groupedTasks[dayIndex].tasks.push(task);
  });

  return groupedTasks;
};

export const transformTasksByPriority = (tasks: Task[]) => {
  const groupedTasks: { title: string; tasks: Task[] }[] = [
    {
      title: 'High',
      tasks: [],
    },
    {
      title: 'Medium',
      tasks: [],
    },
    {
      title: 'Low',
      tasks: [],
    },
  ];

  tasks.forEach((task) => {
    if (task.priority === 1) {
      groupedTasks[0].tasks.push(task);
    } else if (task.priority === 2) {
      groupedTasks[1].tasks.push(task);
    } else if (task.priority === 3) {
      groupedTasks[2].tasks.push(task);
    }
  });

  return groupedTasks;
};
