import * as actionTypes from '../actions/actionTypes';
import 'rxjs';
import {Observable} from 'rxjs/Observable';
import { getEpgSameTime } from '../api'
import { getEpgSameTimeFailure, getEpgSameTimeSuccess } from '../actions/getEpgSameTime'

const getEpgSameTimeEpic = (action$) =>
  action$.ofType(actionTypes.FETCHING_EPG_SAME_TIME)
    .mergeMap(action =>
      Observable.from(getEpgSameTime(action.currentTime, action.channelId))
        .map(response => getEpgSameTimeSuccess(response.data))
        .catch(error => Observable.of(getEpgSameTimeFailure(error)))
    );

export default getEpgSameTimeEpic