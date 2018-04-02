import * as actionTypes from '../actions/actionTypes'
import {getEpgsSuccess, getEpgsFailure} from '../actions/getEPG'
import {getEpgs} from '../api'
import 'rxjs'
import {Observable} from 'rxjs/Observable'

const epgsRequestEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_EPGS)
        .mergeMap(action =>
            Observable.from(getEpgs(action.channelId))
              .map(response => getEpgsSuccess(response.data))
              .catch(error => Observable.of(getEpgsFailure(error)))
        );

export default epgsRequestEpic;