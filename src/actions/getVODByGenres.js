import * as actionTypes from './actionTypes';

export function getVODByGenres(limit, skip, genresId) {
    return {
        type: actionTypes.FETCHING_VOD_BY_GENRES,
        limit: limit,
        skip: skip,
        genresId: genresId
    }
}

export function getVODByGenresSuccess(data) {
    return {
        type: actionTypes.FETCH_VOD_BY_GENRES_SUCCESS,
        data: data.viewer.videoMany
    }
}


export function getVODByGenresFailure(error) {
    return {
        type: actionTypes.FETCH_VOD_BY_GENRES_FAILURE,
        errorMessage: error
    }
}