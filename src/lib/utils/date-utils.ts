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

export const mergeDateAndTime = (date: string, time: string): string => {
  const [year, month, day] = date.split('-');
  const [hours, minutes, seconds] = time.split(':');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};
