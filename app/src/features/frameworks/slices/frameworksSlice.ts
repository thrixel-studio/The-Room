import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { FrameworkKey } from '../types';
import { DEFAULT_FRAMEWORK } from '../types';

interface FrameworksState {
  selectedFramework: FrameworkKey;
}

const initialState: FrameworksState = {
  selectedFramework: DEFAULT_FRAMEWORK,
};

const frameworksSlice = createSlice({
  name: 'frameworks',
  initialState,
  reducers: {
    setFramework: (state, action: PayloadAction<FrameworkKey>) => {
      state.selectedFramework = action.payload;
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedFramework', action.payload);
      }
    },
    initializeFramework: (state, action: PayloadAction<FrameworkKey | null>) => {
      // Initialize from localStorage or user preference
      if (action.payload) {
        state.selectedFramework = action.payload;
      } else if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('selectedFramework');
        if (saved) {
          state.selectedFramework = saved as FrameworkKey;
        }
      }
    },
  },
});

export const { setFramework, initializeFramework } = frameworksSlice.actions;
export default frameworksSlice.reducer;
