import {filterServiceLogOnDate, filterServiceLogOnType} from "../redux/slices/DraftReducer";
import {useDispatch} from "react-redux";

export const useSort = () => {
    const dispatch = useDispatch();
    const sortTableStartDate = () => {
        dispatch(filterServiceLogOnDate());
    };

    const sortTableType = () => {
        dispatch(filterServiceLogOnType());
    };
    return {sortTableStartDate,sortTableType}
}