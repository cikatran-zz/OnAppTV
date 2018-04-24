import * as actionTypes from '../actions/actionTypes';

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false,
};

export default function satelliteReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_SATELLITE:
            return {
                ...state,
                isFetching: true
            };
        case actionTypes.FETCH_SATELLITE_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data
            };
        case actionTypes.FETCH_SATELLITE_FAILURE:
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