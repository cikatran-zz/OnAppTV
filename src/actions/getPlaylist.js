import * as actionTypes from './actionTypes';

export function getPlaylist(playlist) {
    return {
        type: actionTypes.FETCHING_PLAYLIST,
        playlist: playlist
    }
}

export function getPlaylistSuccess(data, playlist) {
    let executedData = data.viewer.listOne.contentData.map(item => {
        let value = Object.assign({}, item);
        value["isLiveList"] = (playlist === 'POPULAR LIVE' || playlist === 'LIVE FOR YOU');
        return value;
    });
    return {
        type: actionTypes.FETCH_PLAYLIST_SUCCESS,
        data: executedData,
        playlist: playlist
    }
}


export function getPlaylistFailure(error) {
    return {
        type: actionTypes.FETCH_PLAYLIST_FAILURE,
        errorMessage: error
    }
}