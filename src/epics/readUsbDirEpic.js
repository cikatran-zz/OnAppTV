import * as actionTypes from '../actions/actionTypes';
import {readUsbDir} from '../api'
import {readUsbDirSuccess, readUsbDirFailure} from '../actions/getUsbDir'
import 'rxjs'
import {Observable} from 'rxjs/Observable'

const readUsbDirEpic = (action$) =>
  action$.ofType(actionTypes.FETCHING_FILES_USB_DIR)
    .mergeMap(action =>
      Observable.from(readUsbDir(action.dir_path))
        .map(response => readUsbDirSuccess(response))
        .catch(error => Observable.of(readUsbDirFailure(error)))
    );

export default readUsbDirEpic
