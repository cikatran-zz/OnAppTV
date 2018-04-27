import * as actionTypes from '../actions/actionTypes'

const initialState = {
  data: null,
  fetched: false,
  isFetching: false,
  error: false,
};

export default function pvrListReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FETCHING_PVR_LIST:
      return {
        ...state,
        data: action.data,
        isFetching: true
      }
    case actionTypes.FETCH_PVR_LIST_SUCCESS:
      return {
        ...state,
        data: action.data,
        isFetching: false,
        fetched: true
      }
    case actionTypes.FETCH_PVR_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
        fetched: true,
        errorMessage: action.errorMessage
      }
    default:
      return state
  }
}