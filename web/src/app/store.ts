import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import ideasReducer from '@/features/ideas/ideaSlice';
import ideaApi from '@/features/ideas/ideaApi';
import notesReducer from '@/features/notes/noteSlice';
import noteApi from '@/features/notes/noteApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ideas: ideasReducer,
    notes: notesReducer,
    [ideaApi.reducerPath]: ideaApi.reducer,
    [noteApi.reducerPath]: noteApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ideaApi.middleware, noteApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
