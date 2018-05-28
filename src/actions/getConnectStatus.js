import * as actionTypes from "./actionTypes"

export function setStatusConnected() {
    return {
        type: actionTypes.CONNECT
    };
}

export function setStatusDisconnected() {
    return {
        type: actionTypes.DISCONNECT
    };
}

