import {combineEpics} from 'redux-observable';
import getBannerEpic from './bannerRequestEpic'
import getChannelEpic from './channelRequestEpic'

const rootEpic = combineEpics(
    getBannerEpic,
    getChannelEpic
);

export default rootEpic;