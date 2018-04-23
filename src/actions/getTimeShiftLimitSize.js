import * as actionTypes from './actionTypes';

export function getTimeShiftLimitSize() {
    return {
        type: actionTypes.FETCHING_TIMESHIFT_LIMITSIZE,
    }
}

export function getTimeShiftLimitSizeSuccess(data) {
    return {
        type: actionTypes.FETCH_TIMESHIFT_LIMITSIZE_SUCCESS,
        data: data
    }
}


export function getTimeShiftLimitSizeFailure(error) {
    return {
        type: actionTypes.FETCH_TIMESHIFT_LIMITSIZE_FAILURE,
        errorMessage: error.errorMessage
    }
}