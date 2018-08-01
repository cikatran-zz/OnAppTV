import * as actionTypes from '../actions/actionTypes';
import _ from 'lodash';
import {NativeModules} from "react-native";


const initialState = {
    data: null,
    fetchedIds: false,
    isFetchingIds: false,
    fetchedMetaData: false,
    isFetchingMetaData: false,
    isUpdating: false,
    updated: false,
    error: null,
};

export default function watchingHistoryReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_WATCHING_HISTORY_IDS:
            return {
                ...state,
                isFetchingIds: true
            };

        case actionTypes.FETCH_WATCHING_HISTORY_IDS_SUCCESS:
            return {
                ...state,
                isFetchingIds: false,
                fetchedIds: true,
                data: action.data.map((x)=>({contentId: x.id,stop_position: x.stop_position})),
                error: null
            };
        case actionTypes.FETCH_WATCHING_HISTORY_IDS_FAILURE:
            return {
                ...state,
                isFetchingIds: false,
                fetchedIds: true,
                error: action.errorMessage
            };
        case actionTypes.FETCHING_WATCHING_HISTORY_METADATA:
            return {
                ...state,
                isFetchingMetaData: true
            };
        case actionTypes.FETCH_WATCHING_HISTORY_METADATA_SUCCESS:
            let uniqueData = _.uniqBy(state.data, 'contentId')
            let newData = uniqueData.map((item)=> {
                let destItems = action.data.filter((it)=> it.contentId === item.contentId);
                if (destItems.length > 0) {
                    let destItem = _.cloneDeep(destItems[0]);
                    destItem["stop_position"] = item.stop_position;
                    return destItem;
                }
                return null;
            });
            newData = _.compact(newData);
            _.reverse(newData);

            if (newData.length > 30)
                newData.splice(29, newData.length - 30);
            console.log("Watching Reducer", newData);
            return {
                ...state,
                isFetchingMetaData: false,
                fetchedMetaData: true,
                data: newData,
                error: null
            };
        case actionTypes.FETCH_WATCHING_HISTORY_METADATA_FAILURE:
            return {
                ...state,
                isFetchingMetaData: false,
                fetchedMetaData: true,
                error: action.errorMessage
            };
        case actionTypes.UPDATING_WATCHING_HISTORY:
            return {
                ...state,
                isUpdating: true
            };
        case actionTypes.UPDATE_WATCHING_HISTORY_SUCCESS:
            return {
                ...state,
                data: _.reverse(action.data),
                isUpdating: false,
                updated: true,
            };
        case actionTypes.UPDATE_WATCHING_HISTORY_FAILURE:
            return {
                ...state,
                isUpdating: false,
                updated: true,
                error: action.errorMessage
            }
        default:
            return state
    }
};