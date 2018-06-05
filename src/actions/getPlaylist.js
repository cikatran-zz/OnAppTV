import * as actionTypes from './actionTypes';

export function getPlaylist(playlist) {
    return {
        type: actionTypes.FETCHING_PLAYLIST,
        playlist: playlist
    }
}

export function getPlaylistSuccess(data, playlist) {
    return {
        type: actionTypes.FETCH_PLAYLIST_SUCCESS,
        data: data.viewer.listOne.contentData,
        playlist: playlist
    }
}


export function getPlaylistFailure(error) {
    return {
        type: actionTypes.FETCH_PLAYLIST_FAILURE,
        errorMessage: error
    }
}