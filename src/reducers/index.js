import {combineReducers} from 'redux';
import nav from './appReducer'
import bannerReducer from './bannerReducer'
import channelReducer from './channelReducer'
import liveReducer from './liveReducer'

export default combineReducers({
    nav,
    bannerReducer,
    channelReducer,
    liveReducer
});
