import * as actionTypes from '../actions/actionTypes';
import {getTimeShiftLimitSizeFailure, getTimeShiftLimitSizeSuccess} from '../actions/getTimeShiftLimitSize';
import {getTimeShiftLimitSize} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getTimeShiftLimitSizeEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_TIMESHIFT_LIMITSIZE)
        .mergeMap(action =>
            Observable.from(getTimeShiftLimitSize())
                .map(response => getTimeShiftLimitSizeSuccess(response))
                .catch(error => Observable.of(getTimeShiftLimitSizeFailure(error)))
        );

export default getTimeShiftLimitSizeEpic;