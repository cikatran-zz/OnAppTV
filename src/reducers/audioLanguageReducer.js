import * as actionTypes from '../actions/actionTypes';

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false,
};

export default function audioLanguageReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_AUDIO_LANGUAGE:
            return {
                ...state,
                data: null,
                isFetching: true
            };
        case actionTypes.FETCH_AUDIO_LANGUAGE_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data
            };
        case actionTypes.FETCH_AUDIO_LANGUAGE_FAILURE:
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