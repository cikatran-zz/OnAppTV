import * as actionTypes from '../actions/actionTypes';

const initialState = {
  data: null,
  fetched: false,
  isFetching: false,
  error: false,
};

export default function vodReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FETCHING_VOD:
      return {
        ...state,
        data: null,
        isFetching: true
      };
    case actionTypes.FETCH_VOD_SUCCESS:
      return {
        ...state,
        isFetching: false,
        fetched: true,
        data: action.data
      };
    case actionTypes.FETCH_VOD_FAILURE:
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