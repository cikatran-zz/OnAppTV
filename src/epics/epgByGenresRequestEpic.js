import * as actionTypes from '../actions/actionTypes';
import 'rxjs';
import {Observable} from 'rxjs/Observable';
import { getEPGByGenres } from '../api'
import { getEPGByGenresFailure, getEPGByGenresSuccess } from '../actions/getEPGByGenres'

const getEPGByGenresEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_EPG_BY_GENRES)
        .mergeMap(action =>
            Observable.from(getEPGByGenres(action.genresId, action.currentTime, action.limit, action.skip))
                .map(response => getEPGByGenresSuccess(response.data, action.limit, action.skip, action.genresId))
                .catch(error => Observable.of(getEPGByGenresFailure(error)))
        );

export default getEPGByGenresEpic