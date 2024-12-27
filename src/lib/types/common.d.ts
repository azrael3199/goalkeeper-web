type TaskMetadata = {
  [key: string]: unknown;
};

export type Weekday = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export type Task = {
  id: string;
  title?: string;
  description?: string;
  parentId?: string;
  priority: number;
  hoursRequired?: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'DONE';
  dateAndTime: string;
  createdAt: string;
  updatedAt: string;
  metadata?: TaskMetadata;
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
