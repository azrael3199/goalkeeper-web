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

export interface Task {
  id: string;
  userId: string;
  title?: string;
  description?: string;
  parentId?: string;
  priority?: number;
  hoursRequired?: number;
  hoursSpent?: number;
  status?: string;
}
