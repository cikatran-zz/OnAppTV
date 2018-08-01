import * as actionTypes from '../actions/actionTypes';
import {getBannerFailure, getBannerSuccess} from '../actions/getBanner';
import {getBanner} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getBannerEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_BANNER)
        .mergeMap(action =>
            Observable.from(getBanner())
                .map(response => getBannerSuccess(response.data))
                .catch(error => Observable.of(getBannerFailure(error)))
        );

export default getBannerEpic;