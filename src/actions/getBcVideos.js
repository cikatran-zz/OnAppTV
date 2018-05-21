import * as actionTypes from './actionTypes';

export function getBcVideos (contentId) {
  return {
    type: actionTypes.FETCHING_BC_VIDEOS,
    contentId: contentId
  }
}

export function getBcVideosSuccess (data) {
  console.log("BC",data);
  return {
    type: actionTypes.FETCH_BC_VIDEOS_SUCCESS,
    data: data.viewer.brightcoveSearchVideo
  }
}

export function getBcVideosFailure (error) {
  return {
    type: actionTypes.FETCH_BC_VIDEOS_FAILURE,
    errorMessage: error
  }
}