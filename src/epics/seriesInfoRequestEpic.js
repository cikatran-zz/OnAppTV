import * as actionTypes from '../actions/actionTypes'

import 'rxjs'
import {Observable} from 'rxjs/Observable'
import { getSeriesInfo } from '../api'
import { getSeriesInfoFailure, getSeriesInfoSuccess } from '../actions/getSeriesInfo'

const seriesInfoRequestEpic = (action$) =>
  action$.ofType(actionTypes.FETCHING_SERIES_INFO)
    .mergeMap(action =>
      Observable.from(getSeriesInfo(action.seriesId))
        .map(response => getSeriesInfoSuccess(response.data))
        .catch(error => Observable.of(getSeriesInfoFailure(error)))
    );

export default seriesInfoRequestEpic