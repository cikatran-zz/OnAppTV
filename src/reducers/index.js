import {combineReducers} from 'redux';
import nav from './appReducer'
import bannerReducer from './bannerReducer'
import channelReducer from './channelReducer'
import categoryReducer from './categoryReducer'
import liveReducer from './liveReducer'
import vodReducer from './vodReducer'
import videoModalReducer from './videoModalReducer'
import adsReducer from "./adsReducer";
import newsReducer from "./newsReducer";
import epgsReducer from './epgsReducer';
import bookListReducer from './bookListReducer'
import genresContentReducer from './genresContentReducer';
import zapperContentReducer from './zapperContentReducer'

export default combineReducers({
    nav,
    bannerReducer,
    channelReducer,
    categoryReducer,
    liveReducer,
    vodReducer,
    videoModalReducer,
    adsReducer,
    newsReducer,
    epgsReducer,
    bookListReducer,
    genresContentReducer,
    zapperContentReducer
});
