import * as actionTypes from './actionTypes';

export function getLive() {
  return {
    type: actionTypes.FETCHING_LIVE,
  }
}

export function getLiveSuccess(data) {
  return {
    type: actionTypes.FETCH_LIVE_SUCCESS,
    data: data.data
  }
}


export function getLiveFailure(error) {
  return {
    type: actionTypes.FETCH_LIVE_FAILURE,
    errorMessage: error
  }
}