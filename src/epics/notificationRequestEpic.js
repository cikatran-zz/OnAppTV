import * as actionTypes from '../actions/actionTypes';
import {getNotificationFailure, getNotificationSuccess} from '../actions/getNotification';
import {getNotification} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getNotificationEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_NOTIFICATION)
        .mergeMap(action =>
            Observable.from(getNotification())
                .map(response => getNotificationSuccess(response))
                .catch(error => Observable.of(getNotificationFailure(error)))
        );

export default getNotificationEpic;