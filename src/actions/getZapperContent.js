import * as actionTypes from './actionTypes';

export function getZapperContentWithChannelId(serviceId) {
    return {
        type: actionTypes.FETCHING_ZAPPER_CONTENT,
        serviceId: serviceId
    }
}

export function getZapperContentSuccess(data) {
    return {
        type: actionTypes.FETCH_ZAPPER_CONTENT_SUCCESS,
        data: data
    }
}


export function getZapperContentFailure(error) {
    return {
        type: actionTypes.FETCH_ZAPPER_CONTENT_FAILURE,
        errorMessage: error
    }
}