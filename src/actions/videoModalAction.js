import * as actionTypes from './actionTypes';

export function showVideoModal(willShow) {
  return {
    type: actionTypes.SHOW_VIDEO_MODAL,
    show: willShow
  }
}