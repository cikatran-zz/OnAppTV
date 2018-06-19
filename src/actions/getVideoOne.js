import * as actionTypes from './actionTypes'

export function getVideoOne (contentId) {
    return {
        type: actionTypes.FETCHING_VIDEO_ONE,
        contentId: contentId
    };
}

export function getVideoOneSuccess (data) {
    return {
        type: actionTypes.FETCH_VIDEO_ONE_SUCCESS,
        data: data.viewer.videoOne
    };
}

export function getVideoOneFailure (error) {
    return {
        type: actionTypes.FETCH_VIDEO_ONE_FAILURE,
        errorMessage: error.errorMessage
    }
}