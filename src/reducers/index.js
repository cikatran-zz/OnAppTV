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
import zapperContentReducer from './zapperContentReducer'
import genresContentReducer from './genresContentReducer'
import recordReducer from './recordReducer'
import audioLanguageReducer from "./audioLanguageReducer";
import settingsReducer from "./settingsReducer";
import subtitlesReducer from "./subtitlesReducer"
import resolutionReducer from "./resolutionReducer";
import videoFormatReducer from './videoFormatReducer';
import wifiInfoReducer from "./wifiInfoReducer";
import seriesInfoReducer from './seriesInfoReducer'
import usbDisksReducer from "./usbDisksReducer";
import satelliteReducer from "./satelliteReducer";
import timeShiftLimitSizeReducer from "./timeShiftLimitSizeReducer";
import notificationReducer from "./notificationReducer"
import profileInfoReducer from "./profileInfoReducer";

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
    zapperContentReducer,
    genresContentReducer,
    recordReducer,
    audioLanguageReducer,
    settingsReducer,
    subtitlesReducer,
    resolutionReducer,
    videoFormatReducer,
    wifiInfoReducer,
    seriesInfoReducer,
    usbDisksReducer,
    satelliteReducer,
    timeShiftLimitSizeReducer,
    notificationReducer,
    profileInfoReducer
});
