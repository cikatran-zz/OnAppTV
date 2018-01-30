import * as actionTypes from './actionTypes';

export function getVOD() {
  return {
    type: actionTypes.FETCHING_VOD,
  }
}

export function getVODSuccess(data) {
  return {
    type: actionTypes.FETCH_VOD_SUCCESS,
    data: data.data
  }
}


export function getVODFailure(error) {
  return {
    type: actionTypes.FETCH_VOD_FAILURE,
    errorMessage: error
  }
}