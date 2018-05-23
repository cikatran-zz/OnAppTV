import * as actionTypes from '../actions/actionTypes';

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false,
};

export default function liveEpgZapperReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_LIVE_EPG_IN_ZAPPER:
            return {
                ...state,
                isFetching: true
            };
        case actionTypes.FETCH_LIVE_EPG_IN_ZAPPER_SUCCESS:
            return {
            ...state,
            isFetching: false,
            fetched: true,
            data: action.data.filter(x => x.epgsData != null && x.epgsData.length != 0).map(x => x.epgsData[0])
        };
        case actionTypes.FETCH_LIVE_EPG_IN_ZAPPER_FAILURE:
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