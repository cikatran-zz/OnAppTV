import * as actionTypes from '../actions/actionTypes'
import {getBookListSuccess, getBookListFailure} from '../actions/getBookList'
import {getBookList} from '../api'
import 'rxjs'
import {Observable} from 'rxjs/Observable'

const getBookingEpic = (action$) =>
  action$.ofType(actionTypes.FETCHING_BOOK_LIST)
    .mergeMap(action =>
        Observable.from(getBookList())
          .map(response => getBookListSuccess(response))
          .catch(error => Observable.of(getBookListFailure(error)))
    );

export default getBookingEpic;