export type RepeatFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export type Weekday = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export type RepeatConfig = {
  frequency: RepeatFrequency; // Frequency type
  startDate: string; // ISO string for start
  endDate?: string; // Optional end date
  daysOfWeek?: number[]; // For WEEKLY: [0 (Sunday), 1 (Monday), ...]
  dayOfMonth?: number; // For MONTHLY: Specific day (e.g., 15th)
  monthOfYear?: number; // For YEARLY: Specific month (0=Jan, 1=Feb)
};

export type TaskMetadata = {
  cloneOf?: string;
};

export type TaskInstance = {
  id: string; // Unique identifier for this instance
  isInstance: boolean; // Reference to the parent task
  dateAndTime: string; // Date and time for this instance
  hoursRequired: number;
  status: 'NOT_STARTED' | 'DONE';
};

export type Task = {
  id: string;
  title?: string;
  description?: string;
  parentId?: string;
  priority: number;
  hoursRequired?: number;
  status: 'NOT_STARTED' | 'DONE';
  dateAndTime: string;
  createdAt: string;
  updatedAt: string;
  metadata?: TaskMetadata;
  repeat?: RepeatConfig;
  unlinkedInstances?: string[];
};

export interface Goal {
  id: string;
  userId: string;
  title?: string;
  description?: string;
  bgImageUrl?: string;
  overlayColor?: string;
  status?: 'IN_PROGRESS' | 'NOT_STARTED' | 'COMPLETED';
  expectedCompletionDate?: string;
  createdAt?: string;
  updatedAt?: string;
  currentHoursSpent?: number;
  expectedHours?: number;
}
