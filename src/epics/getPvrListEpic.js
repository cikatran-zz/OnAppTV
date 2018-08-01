import * as actionTypes from '../actions/actionTypes'
import 'rxjs'
import {Observable} from 'rxjs/Observable'
import { getPvrList } from '../api'
import { getPvrListFailure, getPvrListSuccess } from '../actions/getPvrList'

const getPvrListEpic = (action$) =>
  action$.ofType(actionTypes.FETCHING_PVR_LIST)
    .mergeMap(action =>
      Observable.from(getPvrList())
        .map(response => getPvrListSuccess(response))
        .catch(error => getPvrListFailure(error))
    )

export default getPvrListEpic;