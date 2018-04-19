import * as actionTypes from '../actions/actionTypes';
import {getZapperContentSuccess, getZapperContentFailure} from '../actions/getZapperContent';
import {getZapperContentTimeRange} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getZapperContentEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_ZAPPER_CONTENT)
        .mergeMap(action =>
            Observable.from(getZapperContentTimeRange(action.gtTime, action.ltTime))
                .map(response => getZapperContentSuccess(response.data.viewer.epgRange))
                .catch(error => Observable.of(getZapperContentFailure(error)))
        );

export default getZapperContentEpic;