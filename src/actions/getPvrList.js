import * as actionTypes from './actionTypes'

export function getPvrList () {
  return {
    type: actionTypes.FETCHING_PVR_LIST
  }
}

export function getPvrListSuccess (data) {
  return {
    type: actionTypes.FETCH_PVR_LIST_SUCCESS,
    data: data
  }
}

export function getPvrListFailure (error) {
  return {
    type: actionTypes.FETCH_PVR_LIST_FAILURE,
    errorMessage: error
  }
}