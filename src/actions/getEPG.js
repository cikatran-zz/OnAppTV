import * as actionTypes from './actionTypes'

export function getEpgs(channelId) {
    return {
        type: actionTypes.FETCHING_EPGS,
        channelId: channelId
    }
}

export function getEpgsSuccess(data) {
    return {
        type: actionTypes.FETCH_EPGS_SUCCESS,
        data: data.viewer.channelByContentId
    }
}

export function getEpgsFailure(error) {
    return {
        type: actionTypes.FETCH_EPGS_FAILURE,
        errorMessage: error
    }
}