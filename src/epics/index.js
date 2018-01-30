import {combineEpics} from 'redux-observable';
import getBannerEpic from './bannerRequestEpic'
import getChannelEpic from './channelRequestEpic'
import getCategoryEpic from "./categoryRequestEpic";
import getLiveEpic from './liveRequestEpic'

const rootEpic = combineEpics(
    getBannerEpic,
    getChannelEpic,
    getCategoryEpic,
    getLiveEpic
);

export default rootEpic;