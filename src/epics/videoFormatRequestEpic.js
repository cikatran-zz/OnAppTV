import * as actionTypes from '../actions/actionTypes';
import {getVideoFormatFailure, getVideoFormatSuccess} from '../actions/getVideoFormat';
import {getVideoFormat} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getVideoFormatEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_VIDEO_FORMAT)
        .mergeMap(action =>
            Observable.from(getVideoFormat())
                .map(response => getVideoFormatSuccess(response))
                .catch(error => Observable.of(getVideoFormatFailure(error)))
        );

export default getVideoFormatEpic;