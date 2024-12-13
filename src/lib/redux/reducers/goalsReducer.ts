/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Goal } from '@root/lib/types/common';

interface GoalsState {
  goals: Goal[];
}

const initialState: GoalsState = {
  goals: [],
};

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    addGoal: (state: GoalsState, action: PayloadAction<Goal>) => {
      state.goals.push(action.payload);
    },
    updateGoal: (state: GoalsState, action: PayloadAction<Goal>) => {
      const goalIndex = state.goals.findIndex(
        (goal) => goal.id === action.payload.id
      );
      if (goalIndex !== -1) {
        state.goals[goalIndex] = {
          ...state.goals[goalIndex],
          ...action.payload,
        };
      }
    },
    deleteGoal: (state: GoalsState, action: PayloadAction<string>) => {
      const { payload: id } = action;
      const goalIndex = state.goals.findIndex((goal) => goal.id === id);
      if (goalIndex !== -1) {
        state.goals.splice(goalIndex, 1);
      }
    },
  },
});

export const { addGoal, updateGoal, deleteGoal } = goalsSlice.actions;

export default goalsSlice.reducer;
