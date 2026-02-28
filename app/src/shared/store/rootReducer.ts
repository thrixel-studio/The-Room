import { combineReducers } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import uiReducer from './slices/uiSlice';
import themeReducer from './slices/themeSlice';
import authReducer from '@/features/auth/slices/authSlice';
import frameworksReducer from '@/features/frameworks/slices/frameworksSlice';
import journalUiReducer from '@/features/journal/slices/journalUiSlice';
import chatUiReducer from '@/features/chat/slices/chatUiSlice';
import profileUiReducer from '@/features/settings/slices/profileUiSlice';

export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  ui: uiReducer,
  theme: themeReducer,
  auth: authReducer,
  frameworks: frameworksReducer,
  journalUi: journalUiReducer,
  chatUi: chatUiReducer,
  profileUi: profileUiReducer,
});
