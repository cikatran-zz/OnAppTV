import * as actionTypes from '../actions/actionTypes'
import 'rxjs';
import {Observable} from 'rxjs/Observable';
import {getLiveEpgInChannel} from "../api";
import {getLiveEpgInZapperFailure, getLiveEpgInZapperSuccess} from "../actions/getLiveEpgInZapper";

const getLiveEpgInChannelEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_LIVE_EPG_IN_ZAPPER)
        .mergeMap(action =>
            Observable.from(getLiveEpgInChannel(action.currentTime, action.serviceId))
                .map(response => getLiveEpgInZapperSuccess(response))
                .catch(error => Observable.of(getLiveEpgInZapperFailure(error)))
        );

export default getLiveEpgInChannelEpic;