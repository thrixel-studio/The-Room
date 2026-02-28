import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileUiState {
  isEditing: boolean;
  showDeleteConfirmation: boolean;
}

const initialState: ProfileUiState = {
  isEditing: false,
  showDeleteConfirmation: false,
};

const profileUiSlice = createSlice({
  name: 'profileUi',
  initialState,
  reducers: {
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    setShowDeleteConfirmation: (state, action: PayloadAction<boolean>) => {
      state.showDeleteConfirmation = action.payload;
    },
    toggleEditing: (state) => {
      state.isEditing = !state.isEditing;
    },
  },
});

export const { setIsEditing, setShowDeleteConfirmation, toggleEditing } = profileUiSlice.actions;
export default profileUiSlice.reducer;
