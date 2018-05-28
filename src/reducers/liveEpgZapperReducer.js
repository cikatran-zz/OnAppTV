import * as actionTypes from '../actions/actionTypes';
import _ from 'lodash';

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
            let sortedArr = _.sortBy(action.data, 'serviceId', ['asc'])
                .filter(x => x.epgsData != null && x.epgsData.length !== 0).map(x => x.epgsData[0]);
            return {
            ...state,
            isFetching: false,
            fetched: true,
            data: sortedArr
        };
        case actionTypes.FETCH_LIVE_EPG_IN_ZAPPER_FAILURE:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                errorMessage: action.errorMessage
            };
        case actionTypes.DISABLE_TOUCH:
            return {
                ...state,
                disableTouch: action.data,
                screen: action.screen
            }
        default:
            return state
    }
}