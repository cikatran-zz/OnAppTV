import * as actionTypes from '../actions/actionTypes';

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    favoriteChannels:null,
    error: false,
};

export default function channelReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_CHANNEL:
            return {
                ...state,
                isFetching: true
            };
        case actionTypes.FETCH_CHANNEL_SUCCESS:
            let channelData = action.data ? action.data.filter(item => item.favorite == 1 || item.favorite == true || item.favorite == 1.0) : [];
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data,
                favoriteChannels: channelData
            };
        case actionTypes.FETCH_CHANNEL_FAILURE:
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