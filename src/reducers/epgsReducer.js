import * as actionTypes from '../actions/actionTypes'
import _ from 'lodash'

const initialState = {
  data: null,
  fetched: false,
  isFetching: false,
  error: false,
};

let _id = null;

export default function epgsReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FETCHING_EPGS:
    case actionTypes.FETCHING_EPG_GENRES:
    case actionTypes.FETCHING_EPG_SERIES:
    case actionTypes.FETCHING_VIDEO_IN_SERIES_FROM_PLAYLIST:
      _id = action.contentId ? action.contentId : null;
      return {
        ...state,
        isFetching: true
      };
    case actionTypes.FETCH_EPGS_SUCCESS:
    case actionTypes.FETCH_EPG_GENRES_SUCCESS:
    case actionTypes.FETCH_EPG_SERIES_SUCCESS:
    case actionTypes.FETCH_VIDEO_IN_SERIES_FROM_PLAYLIST_SUCCESS:
        let tempData = null;
        if (action.page === 1) {
            tempData = action.data
        } else {
            tempData = _.concat(...state.data, action.data);
        }
      return {
        ...state,
        data: tempData,
        isFetching: false,
        fetched: true,
        _id: _id
      };
    case actionTypes.FETCH_EPGS_FAILURE:
    case actionTypes.FETCH_EPG_GENRES_FAILURE:
    case actionTypes.FETCH_EPG_SERIES_FAILURE:
    case actionTypes.FETCH_VIDEO_IN_SERIES_FROM_PLAYLIST_FAILURE:
      return {
        ...state,
        isFetching: false,
        fetched: true,
        _id: _id,
        errorMessage: action.errorMessage
      };
    default:
      return state
  }
}