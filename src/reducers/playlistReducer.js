import * as actionTypes from '../actions/actionTypes';
import _ from 'lodash';

const initialState = {
    playlistMap: new Map()
};

export default function playlistReducer(state = initialState, action) {
    let playlistName = "";
    let playlistMap = null;
    let data = null;
    if (action.type.includes("PLAYLIST")) {
        playlistName = action.playlist;
        playlistMap = new Map();
        if (!_.isEmpty(state.playlistMap))
            playlistMap = new Map(state.playlistMap);
        data = playlistMap.get(playlistName);
    }
    switch (action.type) {
        case actionTypes.FETCHING_PLAYLIST:
            if (data) {
                data['isFetching'] = true;
            } else {
                data = {
                    playlist: [],
                    isFetching: true,
                    fetched: false,
                    error: false
                };
                playlistMap.set(playlistName, data)
            }
            return {
                ...state,
                playlistMap: playlistMap
            };
        case actionTypes.FETCH_PLAYLIST_SUCCESS:
            data = {
                playlist: action.data,
                isFetching: false,
                fetched: true,
                error: false
            };
            playlistMap.set(playlistName, data);
            return {
                ...state,
                playlistMap: playlistMap
            };
        case actionTypes.FETCH_PLAYLIST_FAILURE:
            playlistMap.set(playlistName, {
                error: action.errorMessage,
                fetched: true
            })
            return {
                ...state,
                playlistMap: playlistMap,
                error: action.errorMessage
            };
        default:
            return state
    }
};