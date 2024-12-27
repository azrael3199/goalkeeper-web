'use client';

import { Task } from '@root/lib/types/common';
import { isTaskInTheWeek } from './date-utils';

export const transformTasksByStatus = (tasks: Task[], weekStart: Date) => {
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

  tasks
    .filter((task) => isTaskInTheWeek(task, weekStart))
    .forEach((task) => {
      const taskDate = new Date(task.dateAndTime);
      const dayIndex = taskDate.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
      groupedTasks[dayIndex].tasks.push(task);
    });

  return groupedTasks;
};

export const transformTasksByPriority = (tasks: Task[], weekStart: Date) => {
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

  tasks
    .filter((task) => isTaskInTheWeek(task, weekStart))
    .forEach((task) => {
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
