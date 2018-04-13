import * as actionTypes from './actionTypes';

export function getVideoFormat() {
    return {
        type: actionTypes.FETCHING_VIDEO_FORMAT,
    }
}

export function getVideoFormatSuccess(data) {
    return {
        type: actionTypes.FETCH_VIDEO_FORMAT_SUCCESS,
        data: data
    }
}


export function getVideoFormatFailure(error) {
    return {
        type: actionTypes.FETCH_VIDEO_FORMAT_FAILURE,
        errorMessage: error.errorMessage
    }
}