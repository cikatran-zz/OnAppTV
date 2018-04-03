import * as actionTypes from './actionTypes'

export default function getBookList() {
    return {
      type: actionTypes.FETCHING_BOOK_LIST
    }
}

export function getBookListSuccess(data) {
    return {
      type: actionTypes.FETCH_BOOK_LIST_SUCCESS,
      data: data
    }
}

export function getBookListFailure(error) {
    return {
      type: actionTypes.FETCH_BOOK_LIST_FAILURE,
      errorMessage: error
    }
}
