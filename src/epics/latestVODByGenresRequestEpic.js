import * as actionTypes from '../actions/actionTypes';
import 'rxjs';
import {Observable} from 'rxjs/Observable';
import { getVODByGenres } from '../api'
import { getLatestVODByGenresFailure, getLatestVODByGenresSuccess } from '../actions/getLatestVODByGenres'

const getLatestVODByGenresEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_LATEST_VOD_BY_GENRES)
        .mergeMap(action =>
            Observable.from(getVODByGenres(action.genresId, 3, 0))
                .map(response => getLatestVODByGenresSuccess(response.data))
                .catch(error => Observable.of(getLatestVODByGenresFailure(error)))
        );

export default getLatestVODByGenresEpic