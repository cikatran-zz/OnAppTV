import * as actionTypes from '../actions/actionTypes';

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false,
};

export default function settingsReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_SETTINGS:
            return {
                ...state,
                isFetching: true
            };
        case actionTypes.FETCH_SETTINGS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data
            };
        case actionTypes.FETCH_SETTINGS_FAILURE:
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