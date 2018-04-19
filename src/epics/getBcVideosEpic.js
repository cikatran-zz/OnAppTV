import * as actionTypes from '../actions/actionTypes';
import {getBcVideosSuccess, getBcVideosFailure} from '../actions/getBcVideos'
import {getBcVideos} from '../api'
import 'rxjs'
import {Observable} from 'rxjs/Observable'

const getBcVideosEpic = (action$) =>
  action$.ofType(actionTypes.FETCHING_BC_VIDEOS)
      .mergeMap(action =>
          Observable.from(getBcVideos(action.contentId))
            .map(response => getBcVideosSuccess(response.data))
            .catch(error => Observable.of(getBcVideosFailure(error)))
      );

export default getBcVideosEpic;