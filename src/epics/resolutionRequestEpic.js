import * as actionTypes from '../actions/actionTypes';
import {getResolutionFailure, getResolutionSuccess} from '../actions/getResolution';
import {getResolution} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getResolutionEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_RESOLUTION)
        .mergeMap(action =>
            Observable.from(getResolution())
                .map(response => getResolutionSuccess(response))
                .catch(error => Observable.of(getResolutionFailure(error)))
        );

export default getResolutionEpic;