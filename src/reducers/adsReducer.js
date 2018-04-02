import * as actionTypes from '../actions/actionTypes';

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false,
};

export default function adsReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_ADS:
            return {
                ...state,
                data: null,
                isFetching: true
            };
        case actionTypes.FETCH_ADS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data
            };
        case actionTypes.FETCH_ADS_FAILURE:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                errorMessage: action.errorMessage
            };
        default:
            return state
    }
};