import * as actionTypes from './actionTypes'

export function getEpgs(serviceId) {
    return {
        type: actionTypes.FETCHING_EPGS,
        serviceId: serviceId
    }
}

export function getEpgsSuccess(data) {
    return {
        type: actionTypes.FETCH_EPGS_SUCCESS,
        data: data.viewer.channelOne.epgsData
    }
}

export function getEpgsFailure(error) {
    return {
        type: actionTypes.FETCH_EPGS_FAILURE,
        errorMessage: error
    }
}

export function getEpgWithGenres(genresIds, page, perPage) {
    return {
        type: actionTypes.FETCHING_EPG_GENRES,
        genresIds: genresIds,
        page: page,
        perPage: perPage
    }
}

export function getEpgWithGenresSuccess(data, page) {
    return {
        type: actionTypes.FETCH_EPG_GENRES_SUCCESS,
        data: data.viewer.videoPagination.items,
        page: page
    }
}

export function getEpgWithGenresFailure(error) {
    return {
        type: actionTypes.FETCH_EPG_GENRES_FAILURE,
        errorMessage: error
    }
}

export function getEpgWithSeriesId (seriesId, page, perPage) {
    return {
        type: actionTypes.FETCHING_EPG_SERIES,
        seriesId: seriesId,
        page: page,
        perPage: perPage
    }
}

export function getEpgWithSeriesIdSuccess (data, page) {
    return {
        type: actionTypes.FETCH_EPG_SERIES_SUCCESS,
        data: data.viewer.videoPagination.items,
        page: page
    }
}

export function getEpgWithSeriesIdFailure(error) {
    return {
        type: actionTypes.FETCH_EPG_SERIES_FAILURE,
        errorMessage: error
    }
}