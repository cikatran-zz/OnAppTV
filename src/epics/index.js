import {combineEpics} from 'redux-observable';
import getBannerEpic from './bannerRequestEpic'
import getChannelEpic from './channelRequestEpic'
import getLiveEpic from './liveRequestEpic'
import getVODEpic from './vodRequestEpic'
const rootEpic = combineEpics(
    getBannerEpic,
    getChannelEpic,
    getLiveEpic,
    getVODEpic
);

export default rootEpic;