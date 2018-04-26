import * as actionTypes from './actionTypes'

export function getEpgSameTime (currentTime, channelId) {
  return {
    type: actionTypes.FETCHING_EPG_SAME_TIME,
    currentTime: currentTime,
    channelId: channelId
  }
}

export function getEpgSameTimeSuccess (data) {
  return {
    type: actionTypes.FETCH_EPG_SAME_TIME_SUCCESS,
    data: data.viewer.epgMany
  }
}

export function getEpgSameTimeFailure (error) {
  return {
    type: actionTypes.FETCH_EPG_SAME_TIME_FAILURE,
    errorMessage: error
  }
}