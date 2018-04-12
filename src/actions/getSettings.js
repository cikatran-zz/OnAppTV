import * as actionTypes from './actionTypes';

export function getSettings() {
    return {
        type: actionTypes.FETCHING_SETTINGS,
    }
}

export function getSettingsSuccess(data) {
    return {
        type: actionTypes.FETCH_SETTINGS_SUCCESS,
        data: data
    }
}


export function getSettingsFailure(error) {
    return {
        type: actionTypes.FETCH_SETTINGS_FAILURE,
        errorMessage: error.errorMessage
    }
}