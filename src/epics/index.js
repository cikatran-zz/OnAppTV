import {combineEpics} from 'redux-observable';
import getBannerEpic from './bannerRequestEpic'
import getChannelEpic from './channelRequestEpic'
import getCategoryEpic from "./categoryRequestEpic";
import getLiveEpic from './liveRequestEpic'
import getVODEpic from  './vodRequestEpic'
import getAdsEpic from "./adsRequestEpic";
import getNewsEpic from "./newsRequestEpic";

const rootEpic = combineEpics(
    getBannerEpic,
    getChannelEpic,
    getCategoryEpic,
    getLiveEpic,
    getVODEpic,
    getAdsEpic,
    getNewsEpic
);

export default rootEpic;