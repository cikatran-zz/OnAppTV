import * as actionTypes from '../actions/actionTypes';
import _ from 'lodash';
const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false,
};

export default function liveReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_LIVE:
            return {
                ...state,
                isFetching: true
            };
        case actionTypes.FETCH_LIVE_SUCCESS:
            let tempData = null;
            if (action.page === 1) {
                tempData = action.data
            } else {
                tempData = _.concat(...state.data, action.data);
            }

            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: tempData
            };
        case actionTypes.FETCH_LIVE_FAILURE:
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