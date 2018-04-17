import * as actionTypes from '../actions/actionTypes';
import {getZapperContentSuccess, getZapperContentFailure} from '../actions/getZapperContent';
import {getZapperContentWithChannelId} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getZapperContentEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_ZAPPER_CONTENT)
        .mergeMap(action =>
            Observable.from(getZapperContentWithChannelId(action.serviceId))
                .map(response => getZapperContentSuccess(response.data.viewer.channelOne))
                .catch(error => Observable.of(getZapperContentFailure(error)))
        );

export default getZapperContentEpic;