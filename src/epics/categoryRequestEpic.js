import * as actionTypes from '../actions/actionTypes';
import {getCategoryFailure, getCategorySuccess} from '../actions/getCategory';
import {getCategory} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getCategoryEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_CATEGORY)
        .mergeMap(action =>
            Observable.from(getCategory())
                .map(response => getCategorySuccess(response.data))
                .catch(error => Observable.of(getCategoryFailure(error)))
        );

export default getCategoryEpic;