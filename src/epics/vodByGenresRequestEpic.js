import * as actionTypes from '../actions/actionTypes';
import 'rxjs';
import {Observable} from 'rxjs/Observable';
import { getVODByGenres } from '../api'
import { getVODByGenresFailure, getVODByGenresSuccess } from '../actions/getVODByGenres'

const getVODByGenresEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_VOD_BY_GENRES)
        .mergeMap(action =>
            Observable.from(getVODByGenres(action.genresId, action.limit, action.skip))
                .map(response => getVODByGenresSuccess(response.data))
                .catch(error => Observable.of(getVODByGenresFailure(error)))
        );

export default getVODByGenresEpic