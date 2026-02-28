import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface JournalUiState {
  selectedEntryId: string | null;
  isCreating: boolean;
}

const initialState: JournalUiState = {
  selectedEntryId: null,
  isCreating: false,
};

const journalUiSlice = createSlice({
  name: 'journalUi',
  initialState,
  reducers: {
    setSelectedEntry: (state, action: PayloadAction<string | null>) => {
      state.selectedEntryId = action.payload;
    },
    setIsCreating: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload;
    },
    clearSelection: (state) => {
      state.selectedEntryId = null;
    },
  },
});

export const { setSelectedEntry, setIsCreating, clearSelection } = journalUiSlice.actions;
export default journalUiSlice.reducer;
