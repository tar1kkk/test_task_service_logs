import React, { useCallback, useState } from "react";
import { debounce } from "lodash";
import { setSearchQueryProviderId } from "../redux/slices/DraftReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";

export const useFilteredSearch = () => {
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const { drafts } = useSelector((state: RootState) => state.draftReducer);

    const debouncedSearch = useCallback(
        debounce((query: string) => {
            dispatch(setSearchQueryProviderId(query));
        }, 1000),
        []
    );

    const filteredDrafts = drafts.filter((draft) => {
        const queryLower = searchQuery.toLowerCase();
        return (
            draft.providerId.toLowerCase().includes(queryLower) ||
            draft.serviceOrder.toLowerCase().includes(queryLower) ||
            draft.truckId.toLowerCase().includes(queryLower)
        );
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    };

    return {
        searchQuery,
        handleSearch,
        filteredDrafts
    };
};
