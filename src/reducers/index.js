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
import genresContentReducer from './genresContentReducer'
import audioLanguageReducer from "./audioLanguageReducer";
import settingsReducer from "./settingsReducer";
import subtitlesReducer from "./subtitlesReducer"
import resolutionReducer from "./resolutionReducer";
import videoFormatReducer from './videoFormatReducer';
import wifiInfoReducer from "./wifiInfoReducer";

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
    audioLanguageReducer,
    settingsReducer,
    subtitlesReducer,
    resolutionReducer,
    videoFormatReducer,
    wifiInfoReducer
});
