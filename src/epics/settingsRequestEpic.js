import * as actionTypes from '../actions/actionTypes';
import {getSettingsFailure, getSettingsSuccess} from '../actions/getSettings';
import {getSettings} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getSettingsEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_SETTINGS)
        .mergeMap(action =>
            Observable.from(getSettings())
                .map(response => getSettingsSuccess(response))
                .catch(error => Observable.of(getSettingsFailure(error)))
        );

export default getSettingsEpic;