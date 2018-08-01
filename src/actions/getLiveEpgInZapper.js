import * as actionTypes from './actionTypes';

export function getLiveEpgInZapper(currentTime, serviceId) {
    return {
        type: actionTypes.FETCHING_LIVE_EPG_IN_ZAPPER,
        currentTime: currentTime,
        serviceId: serviceId
    }
}

export function getLiveEpgInZapperSuccess(data) {
    return {
        type: actionTypes.FETCH_LIVE_EPG_IN_ZAPPER_SUCCESS,
        data: data.data.viewer.channelPagination.items
    }
}

export function getLiveEpgInZapperFailure(error) {
    return {
        type: actionTypes.FETCH_LIVE_EPG_IN_ZAPPER_FAILURE,
        errorMessage: error
    }
}