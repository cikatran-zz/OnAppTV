import * as actionTypes from './actionTypes'

export default function getRecordList() {
  return {
    type: actionTypes.FETCHING_RECORDS_LIST
  }
}

export function getRecordListSuccess(data) {
  return {
    type: actionTypes.FETCH_RECORDS_LIST_SUCCESS,
    data: data
  }
}

export function getRecordListFailure(error) {
  return {
    type: actionTypes.FETCH_RECORDS_LIST_FAILURE,
    errorMessage: error
  }
}
