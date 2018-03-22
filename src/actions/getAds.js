import * as actionTypes from './actionTypes';

export function getAds() {
    return {
        type: actionTypes.FETCHING_ADS,
    }
}

export function getAdsSuccess(data) {
    return {
        type: actionTypes.FETCH_ADS_SUCCESS,
        data: data.viewer.adsOne
    }
}


export function getAdsFailure(error) {
    return {
        type: actionTypes.FETCH_ADS_FAILURE,
        errorMessage: error
    }
}