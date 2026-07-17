import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import ideasReducer from '@/features/ideas/ideaSlice';
import ideaApi from '@/features/ideas/ideaApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ideas: ideasReducer,
    [ideaApi.reducerPath]: ideaApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ideaApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
