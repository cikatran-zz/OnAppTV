import * as actionTypes from './actionTypes';

export function getLive() {
  return {
    type: actionTypes.FETCHING_CHANNEL,
  }
}

export function getLiveSuccess(data) {
  return {
    type: actionTypes.FETCH_CHANNEL_SUCCESS,
    data: data.data
  }
}


export function getLiveFailure(error) {
  return {
    type: actionTypes.FETCH_CHANNEL_FAILURE,
    errorMessage: error
  }
}