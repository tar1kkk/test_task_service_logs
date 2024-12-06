import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ServiceLog {
    id?: string;
    providerId: string;
    serviceOrder: string;
    truckId: string;
    odometer: number;
    engineHours: number;
    startDate: string;
    endDate: string;
    type: 'planned' | 'unplanned' | 'emergency';
    serviceDescription: string;
}

interface ServiceLogsState {
    serviceLogs: ServiceLog[];
    currentServiceLog: ServiceLog | null;
}

const loadServiceLogsFromLocalStorage = (): ServiceLog[] => {
    try {
        const savedServiceLogs = localStorage.getItem('serviceLogs');
        return savedServiceLogs ? JSON.parse(savedServiceLogs) : [];
    } catch {
        return [];
    }
};

const saveServiceLogsToLocalStorage = (serviceLogs: ServiceLog[]) => {
    localStorage.setItem('serviceLogs', JSON.stringify(serviceLogs));
};

const initialState: ServiceLogsState = {
    serviceLogs: loadServiceLogsFromLocalStorage(),
    currentServiceLog: null,
};

const serviceLogsSlice = createSlice({
    name: 'serviceLogs',
    initialState,
    reducers: {
        createServiceLog(state, action: PayloadAction<ServiceLog>) {
            const newServiceLog = { ...action.payload, id: action.payload.id || Date.now().toString() };
            state.serviceLogs.push(newServiceLog);
            state.currentServiceLog = newServiceLog;
            saveServiceLogsToLocalStorage(state.serviceLogs);
        },
        updateServiceLog(state, action: PayloadAction<ServiceLog>) {
            const index = state.serviceLogs.findIndex(serviceLog => serviceLog.id === action.payload.id);
            if (index !== -1) {
                state.serviceLogs[index] = { ...state.serviceLogs[index], ...action.payload };
                saveServiceLogsToLocalStorage(state.serviceLogs);
            }
        },
        deleteServiceLog(state, action: PayloadAction<string>) {
            state.serviceLogs = state.serviceLogs.filter(serviceLog => serviceLog.providerId !== action.payload);
            if (state.currentServiceLog?.id === action.payload) {
                state.currentServiceLog = null;
            }
            saveServiceLogsToLocalStorage(state.serviceLogs);
        },
        clearAllServiceLogs(state) {
            state.serviceLogs = [];
            state.currentServiceLog = null;
            saveServiceLogsToLocalStorage(state.serviceLogs);
        },
    },
});

export const {
    createServiceLog,
    updateServiceLog,
    deleteServiceLog,
    clearAllServiceLogs
} = serviceLogsSlice.actions;

export default serviceLogsSlice.reducer;
