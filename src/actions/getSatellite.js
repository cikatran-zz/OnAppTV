import * as actionTypes from './actionTypes';

export function getSatellite() {
    return {
        type: actionTypes.FETCHING_SATELLITE,
    }
}

export function getSatelliteSuccess(data) {
    return {
        type: actionTypes.FETCH_SATELLITE_SUCCESS,
        data: data
    }
}


export function getSatelliteFailure(error) {
    return {
        type: actionTypes.FETCH_SATELLITE_FAILURE,
        errorMessage: error.errorMessage
    }
}