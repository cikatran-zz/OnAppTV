import * as actionTypes from './actionTypes';

export function getAudioLanguage() {
    return {
        type: actionTypes.FETCHING_AUDIO_LANGUAGE,
    }
}

export function getAudioLanguageSuccess(data) {
    return {
        type: actionTypes.FETCH_AUDIO_LANGUAGE_SUCCESS,
        data: data
    }
}


export function getAudioLanguageFailure(error) {
    return {
        type: actionTypes.FETCH_AUDIO_LANGUAGE_FAILURE,
        errorMessage: error.errorMessage
    }
}