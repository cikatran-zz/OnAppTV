import * as actionTypes from '../actions/actionTypes';

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false,
};

export default function latestVODByGenresReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_LATEST_VOD_BY_GENRES:
            return {
                ...state,
                isFetching: true
            };
        case actionTypes.FETCH_LATEST_VOD_BY_GENRES_FAILURE:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data
            };
        case actionTypes.FETCH_LATEST_VOD_BY_GENRES_FAILURE:
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