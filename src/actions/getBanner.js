import * as actionTypes from './actionTypes';

export function getBanner() {
  return {
    type: actionTypes.FETCHING_BANNER,
  }
}

export function getBannerSuccess(data) {
  console.log("BANNER",data);
  return {
    type: actionTypes.FETCH_BANNER_SUCCESS,
    data: data.viewer.listOne.mediaData
  }
}


export function getBannerFailure(error) {
  return {
    type: actionTypes.FETCH_BANNER_FAILURE,
    errorMessage: error
  }
}