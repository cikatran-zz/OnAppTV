import * as actionTypes from './actionTypes';

export function getBanner() {
  return {
    type: actionTypes.FETCHING_BANNER,
  }
}

export function getBannerSuccess(data) {
  return {
    type: actionTypes.FETCH_BANNER_SUCCESS,
    data: data.data
  }
}


export function getBannerFailure(error) {
  return {
    type: actionTypes.FETCH_BANNER_FAILURE,
    errorMessage: error
  }
}