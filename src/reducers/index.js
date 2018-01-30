import {combineReducers} from 'redux';
import nav from './appReducer'
import bannerReducer from './bannerReducer'
import channelReducer from './channelReducer'
import liveReducer from './liveReducer'
import vodReducer from './vodReducer'

export default combineReducers({
    nav,
    bannerReducer,
    channelReducer,
    liveReducer,
    vodReducer
});
