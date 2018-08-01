import * as actionTypes from '../actions/actionTypes';
import {getLiveFailure, getLiveSuccess} from '../actions/getLive';
import {getLive} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getLiveEpic = (action$) =>
  action$.ofType(actionTypes.FETCHING_LIVE)
    .mergeMap(action =>
      Observable.from(getLive(action.currentTime, action.page, action.perPage))
        .map(response => getLiveSuccess(response.data, action.page))
        .catch(error => Observable.of(getLiveFailure(error)))
    );

export default getLiveEpic;