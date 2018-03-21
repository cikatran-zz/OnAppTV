import * as actionTypes from './actionTypes';

export function getCategory() {
    return {
        type: actionTypes.FETCHING_CATEGORY,
    }
}

export function getCategorySuccess(data) {
    return {
        type: actionTypes.FETCH_CATEGORY_SUCCESS,
        data: data.viewer.genreMany
    }
}


export function getCategoryFailure(error) {
    return {
        type: actionTypes.FETCH_CATEGORY_FAILURE,
        errorMessage: error
    }
}