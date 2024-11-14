/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Task = {
  id: string;
  title?: string;
  description?: string;
  parentId?: string;
  priority?: number;
  hoursRequired?: number;
  hoursSpent?: number;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
};
interface TasksState {
  tasks: Task[];
}

const initialState: TasksState = {
  tasks: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state: TasksState, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state: TasksState, action: PayloadAction<Task>) => {
      const { id } = action.payload;
      const taskIndex = state.tasks.findIndex((task) => task.id === id);
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = {
          ...state.tasks[taskIndex],
          ...action.payload,
        };
      }
    },
    deleteTask: (state: TasksState, action: PayloadAction<string>) => {
      const { payload: id } = action;
      state.tasks = state.tasks.filter((task) => task.id !== id);
    },
  },
});

export const { addTask, updateTask, deleteTask } = tasksSlice.actions;

export default tasksSlice.reducer;
