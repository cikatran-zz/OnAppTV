import * as actionTypes from '../actions/actionTypes';
import {getAudioLanguageFailure, getAudioLanguageSuccess} from '../actions/getAudioLanguage';
import {getAudioLanguage} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getAudioLanguageEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_AUDIO_LANGUAGE)
        .mergeMap(action =>
            Observable.from(getAudioLanguage())
                .map(response => getAudioLanguageSuccess(response))
                .catch(error => Observable.of(getAudioLanguageFailure(error)))
        );

export default getAudioLanguageEpic;