import * as actionTypes from '../actions/actionTypes';
import {getWifiInfoFailure, getWifiInfoSuccess} from '../actions/getWifiInfo';
import {getWifiInfo} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getWifiInfoEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_WIFI)
        .mergeMap(action =>
            Observable.from(getWifiInfo())
                .map(response => getWifiInfoSuccess(response))
                .catch(error => Observable.of(getWifiInfoFailure(error)))
        );

export default getWifiInfoEpic;