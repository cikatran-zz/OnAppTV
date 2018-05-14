import * as actionTypes from '../actions/actionTypes'
import _ from 'lodash'

const initialState = {
  data: null,
  fetched: false,
  isFetching: false,
  error: false,
};

export default function epgsReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FETCHING_EPGS:
    case actionTypes.FETCHING_EPG_GENRES:
    case actionTypes.FETCHING_EPG_SERIES:
      return {
        ...state,
        isFetching: true
      };
    case actionTypes.FETCH_EPGS_SUCCESS:
    case actionTypes.FETCH_EPG_GENRES_SUCCESS:
    case actionTypes.FETCH_EPG_SERIES_SUCCESS:
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
        fetched: true
      };
    case actionTypes.FETCH_EPGS_FAILURE:
    case actionTypes.FETCH_EPG_GENRES_FAILURE:
    case actionTypes.FETCH_EPG_SERIES_FAILURE:
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