import * as actionTypes from './actionTypes';

export function getProfileInfo() {
    return {
        type: actionTypes.FETCHING_PROFILE_INFO,
    }
}

export function getProfileInfoSuccess(data) {
    return {
        type: actionTypes.FETCH_PROFILE_INFO_SUCCESS,
        data: data
    }
}


export function getProfileInfoFailure(error) {
    return {
        type: actionTypes.FETCH_PROFILE_INFO_FAILURE,
        errorMessage: error.errorMessage
    }
}