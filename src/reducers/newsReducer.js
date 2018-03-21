import * as actionTypes from '../actions/actionTypes';

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false,
};

export default function newsReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_NEWS:
            return {
                ...state,
                data: null,
                isFetching: true
            };
        case actionTypes.FETCH_NEWS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data
            };
        case actionTypes.FETCH_NEWS_FAILURE:
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