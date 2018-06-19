import * as actionTypes from './actionTypes'

export function getEpgs(serviceId, startTime, endTime) {
    return {
        type: actionTypes.FETCHING_EPGS,
        serviceId: serviceId,
        startTime: startTime,
        endTime: endTime
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

export function getEpgWithGenres(contentId, genresIds, page, perPage) {
    return {
        type: actionTypes.FETCHING_EPG_GENRES,
        genresIds: genresIds,
        page: page,
        perPage: perPage,
        contentId: contentId
    }
}

export function getEpgWithGenresSuccess(data, page) {
    return {
        type: actionTypes.FETCH_EPG_GENRES_SUCCESS,
        data: data.viewer.videoPagination.items,
        page: page,
        max: Math.ceil(data.viewer.videoPagination.count / 10)
    }
}

export function getEpgWithGenresFailure(error) {
    return {
        type: actionTypes.FETCH_EPG_GENRES_FAILURE,
        errorMessage: error
    }
}

export function getEpgWithSeriesId (contentId, seriesId, page, perPage) {
    return {
        type: actionTypes.FETCHING_EPG_SERIES,
        seriesId: seriesId,
        page: page,
        perPage: perPage,
        contentId: contentId
    }
}

export function getEpgWithSeriesIdSuccess (data, page) {
    return {
        type: actionTypes.FETCH_EPG_SERIES_SUCCESS,
        data: data.viewer.videoPagination.items,
        page: page,
        max: Math.ceil(data.viewer.videoPagination.count / 10)
    }
}

export function getEpgWithSeriesIdFailure(error) {
    return {
        type: actionTypes.FETCH_EPG_SERIES_FAILURE,
        errorMessage: error
    }
}

export function getVideosInSeriesFromPlaylist (contentId, page, perPage) {
    return {
        type: actionTypes.FETCHING_VIDEO_IN_SERIES_FROM_PLAYLIST,
        contentId: contentId,
        page: page,
        perPage: perPage
    }
}

export function getVideosInSeriesFromPlayistSuccess (data, page) {
    return {
        type: actionTypes.FETCH_VIDEO_IN_SERIES_FROM_PLAYLIST_SUCCESS,
        data: data.viewer.videoPagination.items,
        page: page,
        max: Math.ceil(data.viewer.videoPagination.count / 10)
    };
}

export function getVideosInSeriesFromPlayistFailure (error) {
    return {
        type: actionTypes.FETCH_VIDEO_IN_SERIES_FROM_PLAYLIST_FAILURE,
        errorMessage: error
    }
}