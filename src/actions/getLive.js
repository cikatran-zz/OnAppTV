import * as actionTypes from './actionTypes';

export function getLive(currentTime, page, perPage) {
  return {
    type: actionTypes.FETCHING_LIVE,
      currentTime: currentTime,
      page: page,
      perPage: perPage
  }
}

export function getLiveSuccess(data) {
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