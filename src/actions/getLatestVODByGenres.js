import * as actionTypes from './actionTypes';

export function getLatestVODByGenres(genresId) {
    return {
        type: actionTypes.FETCHING_LATEST_VOD_BY_GENRES,
        genresId: genresId
    }
}

export function getLatestVODByGenresSuccess(data) {
    return {
        type: actionTypes.FETCH_LATEST_VOD_BY_GENRES_SUCCESS,
        data: data.viewer.videoMany
    }
}


export function getLatestVODByGenresFailure(error) {
    return {
        type: actionTypes.FETCH_LATEST_VOD_BY_GENRES_FAILURE,
        errorMessage: error
    }
}