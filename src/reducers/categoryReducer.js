import * as actionTypes from '../actions/actionTypes';

const initialState = {
    data: null,
    fetched: false,
    isFetching: false,
    error: false,
    favorite: null,
};

export default function categoryReducer(state = initialState, action) {
    switch (action.type) {
        case actionTypes.FETCHING_CATEGORY:
            return {
                ...state,
                isFetching: true
            };
        case actionTypes.FETCH_CATEGORY_SUCCESS:
            let favorite = action.data.filter(item => item.favorite === true);
            let categoryData = [];
            if (state.data !== undefined && state.favorite !== undefined) {
                categoryData = (favorite === null || favorite === {}) ? [] : favorite.map(cate => ({"name": cate.name}));
            }
            categoryData.push({"name": "_ADD"});
            return {
                ...state,
                isFetching: false,
                fetched: true,
                data: action.data,
                favorite: categoryData
            };
        case actionTypes.UPDATE_FAVORITE:
            let favorites = action.data;
            let data = state.data;
            favorites.push({"name": "_ADD"});
            for (var i = 0; i < data.length; i++) {
                data[i].favorite = 0;
                for (var j = 0; j < favorites.length; j++) {
                    if (data[i].name == favorites[j].name) {
                        data[i].favorite = 1;
                    }
                }
            }
            return {
                ...state,
                data: data,
                favorite: favorites
            }
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