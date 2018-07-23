import * as actionTypes from './actionTypes';
import _ from 'lodash'

export function getWatchingHistory(dispatch) {
    return {
        type: actionTypes.FETCHING_WATCHING_HISTORY_IDS,
        dispatcher: dispatch
    }
}

export function getWatchingHistoryIDSSuccess(data) {
    return {
        type: actionTypes.FETCH_WATCHING_HISTORY_IDS_SUCCESS,
        data: data
    }
}


export function getWatchingHistoryIDSFailure(error) {
    return {
        type: actionTypes.FETCH_WATCHING_HISTORY_IDS_FAILURE,
        errorMessage: error
    }
}

export function getWatchingHistoryMetaData(ids) {
    return {
        type: actionTypes.FETCHING_WATCHING_HISTORY_METADATA,
        ids: ids
    }
}

export function getWatchingHistoryMetaDataSuccess(data) {
    return {
        type: actionTypes.FETCH_WATCHING_HISTORY_METADATA_SUCCESS,
        data: data.viewer.videoMany
    }
}

export function getWatchingHistoryMetaDataFailure(error) {
    return {
        type: actionTypes.FETCH_WATCHING_HISTORY_METADATA_FAILURE,
        errorMessage: error
    }
}

export function updateWatchingHistory(watchingHistory, contentId, stopPosition, dispatch) {
    let currentItem = null;
    let needFetch = false;
    _.reverse(watchingHistory)
    let updateData = watchingHistory.map((item)=> {
        if (item.contentId === contentId) {
            currentItem = item;
            return null;
        }
        return item
    });
    updateData = _.compact(updateData);
    if(!currentItem) {
        needFetch = true;
        currentItem = {contentId: contentId, stop_position: stopPosition}
    }
    updateData = updateData.concat([currentItem]);
    let storedData = updateData.map((x)=>({id: x.contentId, stop_position: stopPosition}));
    return {
        type: actionTypes.UPDATING_WATCHING_HISTORY,
        storedData: storedData,
        data: updateData,
        needFetch: needFetch,
        dispatcher: dispatch
    }
}

export function updateWatchingHistorySuccess(data) {
    return {
        type: actionTypes.UPDATE_WATCHING_HISTORY_SUCCESS,
        data: data
    }
}

export function updateWatchingHistoryFailure(err) {
    return {
        type: actionTypes.UPDATE_WATCHING_HISTORY_FAILURE,
        errorMessage: err
    }
}