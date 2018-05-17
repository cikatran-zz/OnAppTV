import * as actionTypes from '../actions/actionTypes';
import _ from 'lodash';

const initialState = {
    latestVOD: null,
    vod: null,
    fetched: false,
    isFetching: false,
    error: false,
};

export default function vodByGenresReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_VOD_BY_GENRES:
            return {
                ...state,
                isFetching: true
            };
        case actionTypes.FETCH_VOD_BY_GENRES_SUCCESS:
            let newVOD = action.data;
            let newLatestVOD = state.latestVOD;
            let newBelowVOD = null;
            if (action.page === 1) {
                newLatestVOD = newVOD.slice(0,3);
                newBelowVOD = newVOD.slice(3);
            } else {
                newBelowVOD = _.concat(...state.vod, newVOD)
            }
            return {
                ...state,
                isFetching: false,
                fetched: true,
                latestVOD: newLatestVOD,
                vod: newBelowVOD
            };
        case actionTypes.FETCH_VOD_BY_GENRES_FAILURE:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                errorMessage: action.errorMessage
            };
        default:
            return state
    }
}