import * as actionTypes from '../actions/actionTypes';

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false,
};

export default function categoryReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_CATEGORY:
            return {
                ...state,
                isFetching: true
            };
        case actionTypes.FETCH_CATEGORY_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data,
                favorite: action.data.filter(item => item.favorite === true)
            };
        case actionTypes.FETCH_CATEGORY_FAILURE:
            return {
                ...state,
                isFetching: false,
                fetched: true,
                errorMessage: action.errorMessage
            };
        default:
            return state
    }
};