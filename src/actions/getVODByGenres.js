import * as actionTypes from './actionTypes';

export function getVODByGenres(page, perPage, genresId) {
    return {
        type: actionTypes.FETCHING_VOD_BY_GENRES,
        page: page,
        perPage: perPage,
        genresId: genresId
    }
}

export function getVODByGenresSuccess(data, page) {
    return {
        type: actionTypes.FETCH_VOD_BY_GENRES_SUCCESS,
        data: data.viewer.videoPagination.items,
        page: page
    }
}


export function getVODByGenresFailure(error) {
    return {
        type: actionTypes.FETCH_VOD_BY_GENRES_FAILURE,
        errorMessage: error
    }
}