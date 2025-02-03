'use client';

import { Task, TaskInstance } from '@root/lib/types/common';
import {
  addDays,
  addMonths,
  addYears,
  isWithinInterval,
  parseISO,
} from 'date-fns';
import { isTaskInTheWeek } from './date-utils';

export const transformTasksByStatus = (tasks: Task[], weekStart: Date) => {
  const groupedTasks: { title: string; date: string; tasks: Task[] }[] = [
    {
      title: 'Sunday',
      date: new Date(weekStart).toISOString(),
      tasks: [],
    },
    {
      title: 'Monday',
      date: new Date(weekStart.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      tasks: [],
    },
    {
      title: 'Tuesday',
      date: new Date(
        weekStart.getTime() + 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      tasks: [],
    },
    {
      title: 'Wednesday',
      date: new Date(
        weekStart.getTime() + 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      tasks: [],
    },
    {
      title: 'Thursday',
      date: new Date(
        weekStart.getTime() + 4 * 24 * 60 * 60 * 1000
      ).toISOString(),
      tasks: [],
    },
    {
      title: 'Friday',
      date: new Date(
        weekStart.getTime() + 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      tasks: [],
    },
    {
      title: 'Saturday',
      date: new Date(
        weekStart.getTime() + 6 * 24 * 60 * 60 * 1000
      ).toISOString(),
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

// Utility to check if a date matches days of the week
export const isDayOfWeekIncluded = (
  date: Date,
  daysOfWeek: number[]
): boolean => daysOfWeek.includes(date.getDay());

// Generate instances based on RepeatConfig
export const generateInstances = (
  task: Task,
  rangeStart: Date,
  rangeEnd: Date
): TaskInstance[] => {
  const { frequency, startDate, endDate, daysOfWeek, dayOfMonth, monthOfYear } =
    task.repeat || {};
  const instances: TaskInstance[] = [];

  let currentDate = startDate ? parseISO(startDate) : undefined;

  while (
    currentDate &&
    isWithinInterval(currentDate, { start: rangeStart, end: rangeEnd })
  ) {
    // Stop if endDate is reached
    if (endDate && currentDate > parseISO(endDate)) break;

    // Skip if current date is unlinked
    if (task.unlinkedInstances?.includes(currentDate.toISOString())) {
      if (frequency === 'DAILY' || frequency === 'WEEKLY') {
        currentDate = addDays(currentDate, 1);
      } else if (frequency === 'MONTHLY') {
        currentDate = addMonths(currentDate, 1);
      } else if (frequency === 'YEARLY') {
        currentDate = addYears(currentDate, 1);
      }
    } else {
      // DAILY: Add an instance for each day
      // eslint-disable-next-line no-lonely-if
      if (frequency === 'DAILY') {
        instances.push({
          id: task.id, // Use parent id until instances are modified
          dateAndTime: currentDate.toISOString(),
          status: 'NOT_STARTED',
          isInstance: true,
          hoursRequired: task.hoursRequired || 0,
        });
        currentDate = addDays(currentDate, 1);
      } else if (daysOfWeek && isDayOfWeekIncluded(currentDate, daysOfWeek)) {
        // WEEKLY: Add instances only on matching daysOfWeek
        instances.push({
          id: task.id, // Use parent id until instances are modified
          dateAndTime: currentDate.toISOString(),
          isInstance: true,
          hoursRequired: task.hoursRequired || 0,
          status: 'NOT_STARTED',
        });
        currentDate = addDays(currentDate, 1); // Increment day to check next
      } else if (frequency === 'WEEKLY') {
        currentDate = addDays(currentDate, 1);
      } else if (
        dayOfMonth !== undefined &&
        currentDate.getDate() === dayOfMonth
      ) {
        // MONTHLY: Add instances on matching dayOfMonth
        instances.push({
          id: task.id, // Use parent id until instances are modified
          dateAndTime: currentDate.toISOString(),
          isInstance: true,
          hoursRequired: task.hoursRequired || 0,
          status: 'NOT_STARTED',
        });
        currentDate = addMonths(currentDate, 1);
      } else if (frequency === 'MONTHLY') {
        currentDate = addDays(currentDate, 1);
      } else if (monthOfYear !== undefined && dayOfMonth !== undefined) {
        // YEARLY: Add instances on matching monthOfYear and dayOfMonth
        if (
          currentDate.getMonth() === monthOfYear &&
          currentDate.getDate() === dayOfMonth
        ) {
          instances.push({
            id: task.id, // Use parent id until instances are modified
            dateAndTime: currentDate.toISOString(),
            isInstance: true,
            hoursRequired: task.hoursRequired || 0,
            status: 'NOT_STARTED',
          });
        }
        currentDate = addYears(currentDate, 1);
      } else if (frequency === 'YEARLY') {
        currentDate = addDays(currentDate, 1);
      }
    }
  }

  return instances;
};

export const unlinkInstance = (task: Task, date: string): void => {
  if (!task.unlinkedInstances) {
    // eslint-disable-next-line no-param-reassign
    task.unlinkedInstances = [];
  }
  // Add the unlinked date to the array if not already present
  if (!task.unlinkedInstances.includes(date)) {
    task.unlinkedInstances.push(date);
  }
};
