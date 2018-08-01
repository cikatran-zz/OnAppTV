import * as actionTypes from './actionTypes'

export function disableTouch (isDisable, screen) {
    return {
        type: actionTypes.DISABLE_TOUCH,
        data: isDisable,
        screen: screen
    }
}