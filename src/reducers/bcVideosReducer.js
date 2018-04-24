import * as actionTypes from '../actions/actionTypes';

const initialState = {
  data: null,
  fetched: false,
  isFetching: false,
  error: false,
};

export default function bcVideosReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FETCHING_BC_VIDEOS:
      return {
        ...state,
        isFetching: true
      };
    case actionTypes.FETCH_BC_VIDEOS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        fetched: true,
        data: action.data
      };
    case actionTypes.FETCH_BC_VIDEOS_FAILURE:
      return {
        ...state,
        isFetching: false,
        fetched: true,
        errorMessage: action.errorMessage
      };
    default:
      return state
  }
};