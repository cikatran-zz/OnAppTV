import * as actionTypes from '../actions/actionTypes';
import 'rxjs';
import {Observable} from 'rxjs/Observable';
import {getNews} from "../api";
import {getNewsFailure, getNewsSuccess} from "../actions/getNews";

const getNewsEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_NEWS)
        .mergeMap(action =>
            Observable.from(getNews())
                .map(response => getNewsSuccess(response.data))
                .catch(error => Observable.of(getNewsFailure(error)))
        );

export default getNewsEpic;