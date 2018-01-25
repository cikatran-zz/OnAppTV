import * as actionTypes from '../actions/actionTypes';

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false,
};

export default function bannerReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_CHANNEL:
            return {
                ...state,
                data: null,
                isFetching: true
            };
        case actionTypes.FETCH_CHANNEL_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data
            };
        case actionTypes.FETCH_CHANNEL_FAILURE:
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