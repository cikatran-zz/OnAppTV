import * as actionTypes from '../actions/actionTypes';
import {
    getWatchingHistoryIDSFailure, getWatchingHistoryIDSSuccess, getWatchingHistoryMetaData,
    getWatchingHistoryMetaDataFailure,
    getWatchingHistoryMetaDataSuccess, updateWatchingHistoryFailure, updateWatchingHistorySuccess
} from '../actions/watchingHistory';
import {getWatchingHistory, getContentByIds, updateWatchingHistory} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

export const getWatchingHistoryIDSEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_WATCHING_HISTORY_IDS)
        .mergeMap(action =>
            Observable.from(getWatchingHistory())
                .map(response => {
                        let contentIds = response.map((item)=>item.id);
                        action.dispatcher(getWatchingHistoryMetaData(contentIds));
                        return getWatchingHistoryIDSSuccess(response)
                })
                .catch(error => Observable.of(getWatchingHistoryIDSFailure(error)))
        );

export const getWatchingHistoryMetaDataEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_WATCHING_HISTORY_METADATA)
        .mergeMap(action =>
            Observable.from(getContentByIds(action.ids))
                .map(response =>getWatchingHistoryMetaDataSuccess(response.data))
                .catch(error=>Observable.of(getWatchingHistoryMetaDataFailure(error)))
        );

export const updateWatchingHistoryEpic = (action$) =>
    action$.ofType(actionTypes.UPDATING_WATCHING_HISTORY)
        .mergeMap(action =>
            Observable.from(updateWatchingHistory(action.storedData))
                .map(response =>{
                    if (action.needFetch) {
                        let ids = action.storedData.map((item)=>item.id);
                        action.dispatcher(getWatchingHistoryMetaData(ids))
                    }
                    return updateWatchingHistorySuccess(action.data)
                })
                .catch(error=>Observable.of(updateWatchingHistoryFailure(error)))
        );
