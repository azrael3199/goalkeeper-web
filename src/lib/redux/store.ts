import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './reducers/tasksReducer';

// eslint-disable-next-line import/prefer-default-export
export default configureStore({
  reducer: {
    tasks: tasksReducer,
  },
});
