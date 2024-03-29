import * as actionTypes from '../actions/actionTypes';

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false,
};

export default function zapperContentReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_ZAPPER_CONTENT:
            return {
                ...state,
                isFetching: true
            };
        case actionTypes.FETCH_ZAPPER_CONTENT_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data
            };
        case actionTypes.FETCH_ZAPPER_CONTENT_FAILURE:
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