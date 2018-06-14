import * as actionTypes from '../actions/actionTypes'
import {
    getEpgsSuccess,
    getEpgsFailure,
    getEpgWithGenresSuccess,
    getEpgWithGenresFailure,
    getEpgWithSeriesIdSuccess,
    getEpgWithSeriesIdFailure,
    getVideosInSeriesFromPlayistSuccess,
    getVideosInSeriesFromPlayistFailure
} from '../actions/getEPG'
import { getEpgs, getEpgWithGenres, getEpgWithSeriesId, getVideosInSeriesFromPlaylist } from '../api'
import 'rxjs'
import {Observable} from 'rxjs/Observable'

export const epgsRequestEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_EPGS)
        .mergeMap(action =>
            Observable.from(getEpgs(action.serviceId))
              .map(response => getEpgsSuccess(response.data))
              .catch(error => Observable.of(getEpgsFailure(error)))
        );

export const epgWithGenre = (action$) =>
    action$.ofType(actionTypes.FETCHING_EPG_GENRES)
        .mergeMap(action =>
            Observable.from(getEpgWithGenres(action.genresIds, action.page, action.perPage, [action.contentId]))
              .map(res => getEpgWithGenresSuccess(res.data, action.page))
              .catch(error => Observable.of(getEpgWithGenresFailure(error)))
        );

export const epgWithSeriesId = (action$) =>
    action$.ofType(actionTypes.FETCHING_EPG_SERIES)
        .mergeMap(action =>
            Observable.from(getEpgWithSeriesId(action.seriesId, action.page, action.perPage, [action.contentId]))
              .map(res => getEpgWithSeriesIdSuccess(res.data, action.page))
              .catch(error => Observable.of(getEpgWithSeriesIdFailure(error)))
        );

export const videoInSeriesFromPlaylist = (action$) =>
    action$.ofType(actionTypes.FETCHING_VIDEO_IN_SERIES_FROM_PLAYLIST)
        .mergeMap(action =>
            Observable.from(getVideosInSeriesFromPlaylist(action.contentId, action.page, action.perPage))
                .map(res => getVideosInSeriesFromPlayistSuccess(res.data, action.page))
                .catch(error => getVideosInSeriesFromPlayistFailure(error))
        );