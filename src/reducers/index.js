import {combineReducers} from 'redux';
import nav from './appReducer'
import bannerReducer from './bannerReducer'
import channelReducer from './channelReducer'

export default combineReducers({
    nav,
    bannerReducer,
    channelReducer
});
