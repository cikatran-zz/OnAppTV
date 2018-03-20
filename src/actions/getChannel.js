import * as actionTypes from './actionTypes';

export function getChannel() {
    return {
        type: actionTypes.FETCHING_CHANNEL,
    }
}

export function getChannelSuccess(data) {
    return {
        type: actionTypes.FETCH_CHANNEL_SUCCESS,
        data: data.viewer.channelData
    }
}


export function getChannelFailure(error) {
    return {
        type: actionTypes.FETCH_CHANNEL_FAILURE,
        errorMessage: error
    }
}