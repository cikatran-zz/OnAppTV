import {combineEpics} from 'redux-observable';
import getBannerEpic from './bannerRequestEpic'

const rootEpic = combineEpics(
  getBannerEpic
);

export default rootEpic;