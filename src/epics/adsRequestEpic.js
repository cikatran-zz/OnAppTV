import * as actionTypes from '../actions/actionTypes';
import {getAdsFailure, getAdsSuccess} from '../actions/getAds';
import {getAds} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getAdsEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_ADS)
        .mergeMap(action =>
            Observable.from(getAds())
                .map(response => getAdsSuccess(response.data))
                .catch(error => Observable.of(getAdsFailure(error)))
        );

export default getAdsEpic;