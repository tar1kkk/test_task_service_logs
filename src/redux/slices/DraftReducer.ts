import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Draft {
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

interface DraftsState {
    drafts: Draft[];
    currentDraft: Draft | null;
    isAscendingDate: boolean;
    isAscendingType : boolean;
    searchQuery: string;
}

const loadDraftsFromLocalStorage = (): Draft[] => {
    try {
        const savedDrafts = localStorage.getItem('drafts');
        return savedDrafts ? JSON.parse(savedDrafts) : [];
    } catch {
        return [];
    }
};

const saveDraftsToLocalStorage = (drafts: Draft[]) => {
    localStorage.setItem('drafts', JSON.stringify(drafts));
};

const initialState: DraftsState = {
    drafts: loadDraftsFromLocalStorage(),
    currentDraft: null,
    isAscendingDate: true,
    searchQuery: '',
    isAscendingType : true,

};

const draftsSlice = createSlice({
    name: 'drafts',
    initialState,
    reducers: {
        createDraft(state, action: PayloadAction<Draft>) {
            const newDraft = { ...action.payload, id: action.payload.id || Date.now().toString() };
            state.drafts.push(newDraft);
            state.currentDraft = newDraft;
            saveDraftsToLocalStorage(state.drafts);
        },
        updateDraft(state, action: PayloadAction<Draft>) {
            const index = state.drafts.findIndex(draft => draft.id === action.payload.id);
            if (index !== -1) {
                state.drafts[index] = { ...state.drafts[index], ...action.payload };
                saveDraftsToLocalStorage(state.drafts);
            }
        },
        deleteDraft(state, action: PayloadAction<string>) {
            state.drafts = state.drafts.filter(draft => draft.providerId !== action.payload);
            if (state.currentDraft?.id === action.payload) {
                state.currentDraft = null;
            }
            saveDraftsToLocalStorage(state.drafts);
        },
        filterServiceLogOnDate(state) {
            state.drafts = state.drafts.sort((a, b) => {
                const dateA = new Date(a.startDate);
                const dateB = new Date(b.startDate);
                if (state.isAscendingDate) {
                    return dateA.getTime() - dateB.getTime();
                } else {
                    return dateB.getTime() - dateA.getTime();
                }
            });
            state.isAscendingDate = !state.isAscendingDate;
        },
        filterServiceLogOnType(state) {
            state.drafts = state.drafts.sort((a, b) => {
                if (state.isAscendingType) {
                    return a.type.localeCompare(b.type);
                } else {
                    return b.type.localeCompare(a.type);
                }
            });
            state.isAscendingType = !state.isAscendingType;
        },
        setSearchQueryProviderId(state, action: PayloadAction<string>) {
            state.searchQuery = action.payload;
        },
        clearAllDrafts(state) {
            state.drafts = [];
            state.currentDraft = null;
            saveDraftsToLocalStorage(state.drafts);
        },
    },
});

export const {
    createDraft,
    updateDraft,
    deleteDraft,
    clearAllDrafts,
    filterServiceLogOnDate,
    filterServiceLogOnType,
    setSearchQueryProviderId
} = draftsSlice.actions;

export default draftsSlice.reducer;
