import * as actionTypes from '../actions/actionTypes';
import 'rxjs';
import {Observable} from 'rxjs/Observable';
import { getVideoOne } from '../api'
import { getVideoOneFailure, getVideoOneSuccess } from '../actions/getVideoOne'

const videoOneEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_VIDEO_ONE)
        .mergeMap(action =>
            Observable.from(getVideoOne(action.contentId))
                .map(response => getVideoOneSuccess(response.data))
                .catch(error => Observable.of(getVideoOneFailure(error)))
        );

export default videoOneEpic;
