import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import companyReducer from './slices/companySlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        company: companyReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
