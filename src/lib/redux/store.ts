import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './reducers/tasksReducer';
import goalsReducer from './reducers/goalsReducer';

// eslint-disable-next-line import/prefer-default-export
export default configureStore({
  reducer: {
    tasks: tasksReducer,
    goals: goalsReducer,
  },
});
