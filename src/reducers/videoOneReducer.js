import * as actionTypes from '../actions/actionTypes';

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false,
};

export default function videoOneReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_VIDEO_ONE:
            return {
                ...state,
                isFetching: true
            };
        case actionTypes.FETCH_VIDEO_ONE_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data
            };
        case actionTypes.FETCH_VIDEO_ONE_FAILURE:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                error: true,
                errorMessage: action.errorMessage
            };
        default:
            return state;
    }
}