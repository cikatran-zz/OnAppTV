import * as actionTypes from './actionTypes';

export function getEPGByGenres(limit, skip, genresId, currentTime) {
    return {
        type: actionTypes.FETCHING_EPG_BY_GENRES,
        limit: limit,
        skip: skip,
        genresId: genresId,
        currentTime: currentTime
    }
}

export function getEPGByGenresSuccess(data) {
    return {
        type: actionTypes.FETCH_EPG_BY_GENRES_SUCCESS,
        data: data.viewer.epgMany
    }
}


export function getEPGByGenresFailure(error) {
    return {
        type: actionTypes.FETCH_EPG_BY_GENRES_FAILURE,
        errorMessage: error
    }
}