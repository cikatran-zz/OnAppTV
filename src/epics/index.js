import {combineEpics} from 'redux-observable';
import getBannerEpic from './bannerRequestEpic'
import getChannelEpic from './channelRequestEpic'
import getCategoryEpic from "./categoryRequestEpic";
import getLiveEpic from './liveRequestEpic'
import getVODEpic from  './vodRequestEpic'
import getAdsEpic from "./adsRequestEpic";
import getNewsEpic from "./newsRequestEpic";
import {epgsRequestEpic, epgWithGenre, epgWithSeriesId } from './epgsRequestEpic'
import getBookingEpic from './bookingRequestEpic'
import getGenresContentEpic from "./genresContentRequestEpic";
import getZapperContentRequestEpic from './zapperContentRequestEpic'
import getRecordsEpic from './recordRequestEpic'
import getAudioLanguageEpic from "./audioLanguageRequestEpic";
import getSettingsEpic from "./settingsRequestEpic";
import getSubtitlesEpic from "./subtitlesRequestEpic";
import getResolutionEpic from "./resolutionRequestEpic";
import getVideoFormatEpic from "./videoFormatRequestEpic";
import seriesInfoRequestEpic from "./seriesInfoRequestEpic"

const rootEpic = combineEpics(
    getBannerEpic,
    getChannelEpic,
    getCategoryEpic,
    getLiveEpic,
    getVODEpic,
    getAdsEpic,
    getNewsEpic,
    epgsRequestEpic,
    epgWithGenre,
    epgWithSeriesId,
    getBookingEpic,
    getGenresContentEpic,
    getRecordsEpic,
    getAudioLanguageEpic,
    getSettingsEpic,
    getSubtitlesEpic,
    getResolutionEpic,
    getVideoFormatEpic,
    seriesInfoRequestEpic,
    getZapperContentRequestEpic,
);

export default rootEpic;