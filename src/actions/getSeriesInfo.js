import * as actionTypes from './actionTypes'

export function getSeriesInfo(seriesId) {
  return {
    type: actionTypes.FETCHING_SERIES_INFO,
    seriesId: seriesId
  }
}

export function getSeriesInfoSuccess(data) {
  return {
    type: actionTypes.FETCH_SERIES_INFO_SUCCESS,
    data: data.viewer.seriesOne
  }
}

export function getSeriesInfoFailure (error) {
  return {
    type: actionTypes.FETCH_SERIES_INFO_FAILURE,
    errorMessage: error
  }
}