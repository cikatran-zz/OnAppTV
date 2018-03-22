import * as actionTypes from './actionTypes';

export function getNews() {
    return {
        type: actionTypes.FETCHING_NEWS,
    }
}

export function getNewsSuccess(data) {
    return {
        type: actionTypes.FETCH_NEWS_SUCCESS,
        data: data.viewer.newsOne
    }
}


export function getNewsFailure(error) {
    return {
        type: actionTypes.FETCH_NEWS_FAILURE,
        errorMessage: error
    }
}