import * as actionTypes from './actionTypes';

export function getChannel(limit) {
    return {
        type: actionTypes.FETCHING_CHANNEL,
        limit: limit
    }
}

export function getChannelSuccess(data) {
    return {
        type: actionTypes.FETCH_CHANNEL_SUCCESS,
        data: data.viewer.channelMany
    }
}


export function getChannelFailure(error) {
    return {
        type: actionTypes.FETCH_CHANNEL_FAILURE,
        errorMessage: error
    }
}