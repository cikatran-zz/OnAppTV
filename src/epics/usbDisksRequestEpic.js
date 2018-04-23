import * as actionTypes from '../actions/actionTypes';
import {getUSBDisksFailure, getUSBDisksSuccess} from '../actions/getUSBDisks';
import {getUSBDisks} from '../api';
import 'rxjs';
import {Observable} from 'rxjs/Observable';

const getUSBDisksEpic = (action$) =>
    action$.ofType(actionTypes.FETCHING_USB_DISKS)
        .mergeMap(action =>
            Observable.from(getUSBDisks())
                .map(response => getUSBDisksSuccess(response))
                .catch(error => Observable.of(getUSBDisksFailure(error)))
        );

export default getUSBDisksEpic;