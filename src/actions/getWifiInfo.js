import * as actionTypes from './actionTypes';

export function getWifiInfo() {
    return {
        type: actionTypes.FETCHING_WIFI,
    }
}

export function getWifiInfoSuccess(data) {
    return {
        type: actionTypes.FETCH_WIFI_SUCCESS,
        data: data
    }
}


export function getWifiInfoFailure(error) {
    return {
        type: actionTypes.FETCH_WIFI_FAILURE,
        errorMessage: error.errorMessage
    }
}