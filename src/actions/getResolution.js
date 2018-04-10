import * as actionTypes from './actionTypes';

export function getResolution() {
    return {
        type: actionTypes.FETCHING_RESOLUTION,
    }
}

export function getResolutionSuccess(data) {
    return {
        type: actionTypes.FETCH_RESOLUTION_SUCCESS,
        data: data
    }
}


export function getResolutionFailure(error) {
    return {
        type: actionTypes.FETCH_RESOLUTION_FAILURE,
        errorMessage: error.errorMessage
    }
}