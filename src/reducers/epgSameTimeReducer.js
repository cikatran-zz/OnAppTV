import * as actionTypes from '../actions/actionTypes';

const initialState = {
  data: null,
  fetched: false,
  isFetching: false,
  error: false,
};

export default function epgSameTimeReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FETCHING_EPG_SAME_TIME:
      return {
        ...state,
        isFetching: true
      }
    case actionTypes.FETCH_EPG_SAME_TIME_SUCCESS:
      return {
        ...state,
        isFetching: false,
        fetched: true,
        data: action.data
      }
    case actionTypes.FETCH_EPG_SAME_TIME_FAILURE:
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