import * as actionTypes from './actionTypes';

export function updateFavorite(favorites) {
    return {
        type: actionTypes.UPDATE_FAVORITE,
        data: favorites
    }
}
