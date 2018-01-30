import {combineEpics} from 'redux-observable';
import getBannerEpic from './bannerRequestEpic'
import getChannelEpic from './channelRequestEpic'
import getCategoryEpic from "./categoryRequestEpic";

const rootEpic = combineEpics(
    getBannerEpic,
    getChannelEpic,
    getCategoryEpic
);

export default rootEpic;