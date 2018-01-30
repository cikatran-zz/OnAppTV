import * as actionTypes from '../actions/actionTypes';
import {getVODFailure, getVODSuccess} from '../actions/getVOD';
import {getVOD} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getVODEpic = (action$) =>
  action$.ofType(actionTypes.FETCHING_VOD)
    .mergeMap(action =>
      Observable.from(getVOD())
        .map(response => getVODSuccess(response.data))
        .catch(error => Observable.of(getVODFailure(error)))
    );

export default getVODEpic;