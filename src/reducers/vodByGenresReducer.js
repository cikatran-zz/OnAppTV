import * as actionTypes from '../actions/actionTypes';
import _ from 'lodash';

const initialState = {
    vodMap: new Map()
};

export default function vodByGenresReducer(state = initialState, action) {
    let genresId = "";
    let vodMap = null;
    let data = null;
    if (action.type.includes("VOD_BY_GENRES")) {
        genresId = action.genresId;
        vodMap = new Map();
        if (!_.isEmpty(state.vodMap))
            vodMap = new Map(state.vodMap);
        data = vodMap.get(genresId);
    }
    switch (action.type) {
        case actionTypes.FETCHING_VOD_BY_GENRES:

            if (data) {
                data['isFetching'] = true;
            } else {
                data = {
                    page: action.page,
                    vod: [],
                    isFetching: true,
                    latestVOD: [],
                    fetched: false,
                    error: false
                };
                vodMap.set(action.genresId, data)
            }
            return {
                ...state,
                vodMap: vodMap
            };
        case actionTypes.FETCH_VOD_BY_GENRES_SUCCESS:

            let newVOD = action.data;
            let newLatestVOD = data.latestVOD;
            let fetchedVOD = data.vod;
            let newBelowVOD = null;
            if (action.page === 1) {
                newLatestVOD = newVOD.slice(0,3);
                newBelowVOD = newVOD.slice(3);
            } else {
                newBelowVOD = _.concat(fetchedVOD, newVOD)
            }
            vodMap.set(genresId, {
                page: action.page,
                vod: newBelowVOD,
                isFetching: false,
                latestVOD: newLatestVOD,
                fetched: true
            });
            return {
                ...state,
                vodMap: vodMap
            };
        case actionTypes.FETCH_VOD_BY_GENRES_FAILURE:
            vodMap.set(genresId, {
                error: action.errorMessage,
                fetched: true
            })
            return {
                ...state,
                vodMap: vodMap,
                error: action.errorMessage
            };
        default:
            return state
    }
}