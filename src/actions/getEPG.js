import * as actionTypes from './actionTypes'

export function getEpgs(channelId) {
    return {
        type: actionTypes.FETCHING_EPGS,
        channelId: channelId
    }
}

export function getEpgsSuccess(data) {
    return {
        type: actionTypes.FETCH_EPGS_SUCCESS,
        data: data.viewer.channelById
    }
}

export function getEpgsFailure(error) {
    return {
        type: actionTypes.FETCH_EPGS_FAILURE,
        errorMessage: error
    }
}

export function getEpgWithGenres(genresIds) {
    return {
        type: actionTypes.FETCHING_EPG_GENRES,
        genresIds: genresIds
    }
}

export function getEpgWithGenresSuccess(data) {
    return {
        type: actionTypes.FETCH_EPG_GENRES_SUCCESS,
        data: data.viewer.videoMany
    }
}

export function getEpgWithGenresFailure(error) {
    return {
        type: actionTypes.FETCH_EPG_GENRES_FAILURE,
        errorMessage: error
    }
}

export function getEpgWithSeriesId (seriesId) {
  return {
    type: actionTypes.FETCHING_EPG_SERIES,
    seriesId: seriesId
  }
}

export function getEpgWithSeriesIdSuccess (data) {
  return {
    type: actionTypes.FETCH_EPG_SERIES_SUCCESS,
    data: data.viewer.videoMany
  }
}

export function getEpgWithSeriesIdFailure(error) {
  return {
    type: actionTypes.FETCH_EPG_SERIES_FAILURE,
    errorMessage: error
  }
}