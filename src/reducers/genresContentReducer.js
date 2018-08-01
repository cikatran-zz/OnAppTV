import * as actionTypes from '../actions/actionTypes'

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false,
};

export default function genresContentReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_GENRES_CONTENT:
            return {
                ...state,
                isFetching: true
            };
        case actionTypes.FETCH_GENRES_CONTENT_SUCCESS:
            return {
                ...state,
                data: action.data,
                isFetching: false,
                fetched: true
            };
        case actionTypes.FETCH_GENRES_CONTENT_FAILTURE:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                errorMessage: action.errorMessage
            };
        default:
            return state
    }
}