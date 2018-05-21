import * as actionTypes from '../actions/actionTypes';
import _ from 'lodash'

const initialState = {
    epgMap: new Map()
};

export default function epgByGenresReducer(state = initialState, action) {
    let genresId = "";
    let epgMap = null;
    let data = null;
    if (action.type.includes("EPG_BY_GENRES")) {
        genresId = action.genresId;
        epgMap = new Map();
        if (!_.isEmpty(state.epgMap))
            epgMap = new Map(state.epgMap);
        data = epgMap.get(genresId);
    }
    switch (action.type) {
        case actionTypes.FETCHING_EPG_BY_GENRES:
            if (data) {
                data['isFetching'] = true;
            } else {
                data = {
                    skip: action.skip,
                    epg: [],
                    isFetching: true,
                    fetched: false,
                    error: false
                };
                epgMap.set(action.genresId, data)
            }
            return {
                ...state,
                epgMap: epgMap
            }
        case actionTypes.FETCH_EPG_BY_GENRES_SUCCESS:
            let newEPG = action.data;
            if (data.epg != null) {
                newEPG = _.concat(data.epg, newEPG)
            }
            let epgQuerySkip = (newEPG != null) ? newEPG.length : 0;
            epgMap.set(genresId, {
                skip: epgQuerySkip,
                epg: newEPG,
                isFetching: false,
                fetched: true
            });
            return {
                ...state,
               epgMap: epgMap
            }
        case actionTypes.FETCH_EPG_BY_GENRES_FAILURE:
            epgMap.set(genresId, {
                error: action.errorMessage,
                fetched: true
            })
            return {
                ...state,
                epgMap: epgMap,
                error: action.errorMessage
            };
        default:
            return state
    }
}