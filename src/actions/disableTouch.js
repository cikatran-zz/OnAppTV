import * as actionTypes from './actionTypes'

export function disableTouch (isDisable) {
    return {
        type: actionTypes.DISABLE_TOUCH,
        data: isDisable
    }
}