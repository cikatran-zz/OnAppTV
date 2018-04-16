import * as actionTypes from './actionTypes';

export function getUSBDisks() {
    return {
        type: actionTypes.FETCHING_USB_DISKS,
    }
}

export function getUSBDisksSuccess(data) {
    return {
        type: actionTypes.FETCH_USB_DISKS_SUCCESS,
        data: data
    }
}


export function getUSBDisksFailure(error) {
    return {
        type: actionTypes.FETCH_USB_DISKS_FAILURE,
        errorMessage: error.errorMessage
    }
}