import * as actionTypes from '../actions/actionTypes';

const initialState = {
    isConnect: false
};

export default function connectStatusReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.CONNECT:
            return {
                isConnect: true
            };
        case actionTypes.DISCONNECT:
            return {
                isConnect: false
            };
        default:
            return state;
    }
}