import * as actionTypes from '../actions/actionTypes';

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false,
};

export default function epgByGenresReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_EPG_BY_GENRES:
            return {
                ...state,
                isFetching: true
            }
        case actionTypes.FETCH_EPG_BY_GENRES_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data//[...((state.data != null) ? state.data: []), ...action.data]
            }
        case actionTypes.FETCH_EPG_BY_GENRES_FAILURE:
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