import * as actionTypes from '../actions/actionTypes';
import {getGenresContentFailure, getGenresContentSuccess} from '../actions/getGenresContent';
import {getGenresContent} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getGenresContentEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_GENRES_CONTENT)
        .mergeMap(action =>
            Observable.from(getGenresContent(action.genresIDs))
                .map(response => getGenresContentSuccess(response))
                .catch(error => Observable.of(getGenresContentFailure(error)))
        );

export default getGenresContentEpic;