import * as actionTypes from './actionTypes';

export function getLive(currentTime) {
  return {
    type: actionTypes.FETCHING_LIVE,
      currentTime: currentTime
  }
}

export function getLiveSuccess(data) {
    console.log(data)
  return {
    type: actionTypes.FETCH_LIVE_SUCCESS,
    data: data.viewer.channelPagination.items
  }
}


export function getLiveFailure(error) {
  return {
    type: actionTypes.FETCH_LIVE_FAILURE,
    errorMessage: error
  }
}