'use client';

import { isWithinInterval, startOfWeek, endOfWeek } from 'date-fns';
import { Task } from '../types/common';

export const isTaskInTheWeek = (task: Task, weekStart: Date): boolean => {
  const taskDate = new Date(task.dateAndTime);
  const start = startOfWeek(weekStart);
  const end = endOfWeek(weekStart);

  return isWithinInterval(taskDate, { start, end });
};

export const isTaskWithinMonth = (task: Task, monthStart: Date): boolean => {
  const taskDate = new Date(task.dateAndTime);
  return (
    taskDate.getMonth() === monthStart.getMonth() &&
    taskDate.getFullYear() === monthStart.getFullYear()
  );
};

export const isTaskWithinYear = (task: Task, yearStart: Date): boolean => {
  const taskDate = new Date(task.dateAndTime);
  return taskDate.getFullYear() === yearStart.getFullYear();
};
