import * as actionTypes from '../actions/actionTypes';
import {getProfileInfoFailure, getProfileInfoSuccess} from '../actions/getProfileInfo';
import {getProfileInfo} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getProfileInfoEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_PROFILE_INFO)
        .mergeMap(action =>
            Observable.from(getProfileInfo())
                .map(response => getProfileInfoSuccess(response))
                .catch(error => Observable.of(getProfileInfoFailure(error)))
        );

export default getProfileInfoEpic;