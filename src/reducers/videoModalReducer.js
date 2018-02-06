import * as actionTypes from '../actions/actionTypes';

const initialState = {
  show: false
};

export default function videoModalReducer(state = initialState, action){
  switch (action.type) {
    case actionTypes.SHOW_VIDEO_MODAL:
      return {
        ...state,
        show: action.show
      }
    default:
      return state
  }
}