import * as actionTypes from './actionTypes';

export function getVOD(page, itemPerPage) {
  return {
    type: actionTypes.FETCHING_VOD,
      page: page,
      itemPerPage: itemPerPage
  }
}

export function getVODSuccess(data) {
  return {
    type: actionTypes.FETCH_VOD_SUCCESS,
    data: data.viewer.videoPagination.items
  }
}


export function getVODFailure(error) {
  return {
    type: actionTypes.FETCH_VOD_FAILURE,
    errorMessage: error
  }
}