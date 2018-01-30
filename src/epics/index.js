import {combineEpics} from 'redux-observable';
import getBannerEpic from './bannerRequestEpic'
import getChannelEpic from './channelRequestEpic'
import getLiveEpic from './liveRequestEpic'
const rootEpic = combineEpics(
    getBannerEpic,
    getChannelEpic,
    getLiveEpic
);

export default rootEpic;