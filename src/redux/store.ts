import {configureStore} from '@reduxjs/toolkit';
import draftReducer from '../redux/slices/DraftReducer';
import serviceLogsReducer from "./slices/ServiceLogsReducer";

export const store = configureStore({
    reducer: {
        draftReducer,
        serviceLogsReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
