import {combineReducers} from 'redux';
import nav from './appReducer'
import bannerReducer from './bannerReducer'
import channelReducer from './channelReducer'
import categoryReducer from './categoryReducer'

export default combineReducers({
    nav,
    bannerReducer,
    channelReducer,
    categoryReducer
});
