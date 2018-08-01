import * as actionTypes from '../actions/actionTypes'

const initialState = {
  data: null,
  fetched: false,
  isFetching: false,
  error: false,
};

export default function usbDirReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.FETCHING_FILES_USB_DIR:
      return {
        ...state,
        isFetching: true
      }
    case actionTypes.FETCH_FILES_USB_DIR_SUCCESS:
      return {
        ...state,
        data: action.data,
        isFetching: false,
        fetched: true
      }
    case actionTypes.FETCH_FILES_USB_DIR_FAILURE:
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