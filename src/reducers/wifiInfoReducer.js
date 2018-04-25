import * as actionTypes from '../actions/actionTypes';

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false,
};

export default function wifiInfoReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_WIFI:
            return {
                ...state,
                isFetching: true
            };
        case actionTypes.FETCH_WIFI_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data
            };
        case actionTypes.FETCH_WIFI_FAILURE:
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