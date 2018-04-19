import * as actionTypes from '../actions/actionTypes';

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false,
};

export default function timeShiftLimitSizeReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_TIMESHIFT_LIMITSIZE:
            return {
                ...state,
                data: null,
                isFetching: true
            };
        case actionTypes.FETCH_TIMESHIFT_LIMITSIZE_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data
            };
        case actionTypes.FETCH_TIMESHIFT_LIMITSIZE_FAILURE:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                error: true,
                errorMessage: action.errorMessage
            };
        default:
            return state
    }
};