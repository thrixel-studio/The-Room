import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatUiState {
  isGenerating: boolean;
  showModal: boolean;
  sessionId: string | null;
}

const initialState: ChatUiState = {
  isGenerating: false,
  showModal: false,
  sessionId: null,
};

const chatUiSlice = createSlice({
  name: 'chatUi',
  initialState,
  reducers: {
    setIsGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },
    setShowModal: (state, action: PayloadAction<boolean>) => {
      state.showModal = action.payload;
    },
    setSessionId: (state, action: PayloadAction<string | null>) => {
      state.sessionId = action.payload;
    },
    resetChatUi: (state) => {
      state.isGenerating = false;
      state.showModal = false;
      state.sessionId = null;
    },
  },
});

export const { setIsGenerating, setShowModal, setSessionId, resetChatUi } = chatUiSlice.actions;
export default chatUiSlice.reducer;
