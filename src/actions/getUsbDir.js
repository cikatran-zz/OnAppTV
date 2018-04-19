import * as actionTypes from './actionTypes';

export function readUsbDir (dir_path) {
  return {
    type: actionTypes.FETCHING_FILES_USB_DIR,
    dir_path: dir_path
  }
}

export function readUsbDirSuccess (data) {
  return {
    type: actionTypes.FETCH_FILES_USB_DIR_SUCCESS,
    data: data
  }
}

export function readUsbDirFailure (error) {
  return {
    type: actionTypes.FETCH_FILES_USB_DIR_FAILURE,
    errorMessage: error
  }
}