import * as actionTypes from '../actions/actionTypes';
import {getSatelliteFailure, getSatelliteSuccess} from '../actions/getSatellite';
import {getSatellite} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getSatelliteEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_SATELLITE)
        .mergeMap(action =>
            Observable.from(getSatellite())
                .map(response => getSatelliteSuccess(response))
                .catch(error => Observable.of(getSatelliteFailure(error)))
        );

export default getSatelliteEpic;