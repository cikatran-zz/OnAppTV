import * as actionTypes from './actionTypes';

export function getGenresContent(genresIDs) {
    return {
        type: actionTypes.FETCHING_GENRES_CONTENT,
        genresIDs: genresIDs
    }
}

export function getGenresContentSuccess(data) {
    return {
        type: actionTypes.FETCH_GENRES_CONTENT_SUCCESS,
        data: data
    }
}


export function getGenresContentFailure(error) {
    return {
        type: actionTypes.FETCH_GENRES_CONTENT_FAILTURE,
        errorMessage: error
    }
}