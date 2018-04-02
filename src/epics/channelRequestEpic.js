import * as actionTypes from '../actions/actionTypes';
import {getChannelFailure, getChannelSuccess} from '../actions/getChannel';
import {getChannel} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getChannelEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_CHANNEL)
        .mergeMap(action =>
            Observable.from(getChannel(action.limit))
                .map(response => getChannelSuccess(response))
                .catch(error => Observable.of(getChannelFailure(error)))
        );

export default getChannelEpic;