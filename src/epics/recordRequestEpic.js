import * as actionTypes from '../actions/actionTypes'
import {getRecordListSuccess, getRecordListFailure} from '../actions/getRecordList'
import {getRecordList} from '../api'
import 'rxjs'
import {Observable} from 'rxjs/Observable'

const getRecordsEpic = (action$) =>
  action$.ofType(actionTypes.FETCHING_RECORDS_LIST)
    .mergeMap(action =>
      Observable.from(getRecordList())
        .map(response => getRecordListSuccess(response))
        .catch(error => Observable.of(getRecordListFailure(error)))
    );

export default getRecordsEpic;