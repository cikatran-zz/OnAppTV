import * as actionTypes from '../actions/actionTypes';
import {getSubtitlesFailure, getSubtitlesSuccess} from '../actions/getSubtitles';
import {getSubtitles} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getSubtitlesEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_SUBTITLES)
        .mergeMap(action =>
            Observable.from(getSubtitles())
                .map(response => getSubtitlesSuccess(response))
                .catch(error => Observable.of(getSubtitlesFailure(error)))
        );

export default getSubtitlesEpic;