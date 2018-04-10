import * as actionTypes from './actionTypes';

export function getSubtitles() {
    return {
        type: actionTypes.FETCHING_SUBTITLES,
    }
}

export function getSubtitlesSuccess(data) {
    return {
        type: actionTypes.FETCH_SUBTITLES_SUCCESS,
        data: data
    }
}


export function getSubtitlesFailure(error) {
    return {
        type: actionTypes.FETCH_SUBTITLES_FAILURE,
        errorMessage: error.errorMessage
    }
}