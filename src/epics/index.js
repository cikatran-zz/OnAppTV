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
import getWifiInfoEpic from "./wifiInfoRequestEpic";
import seriesInfoRequestEpic from "./seriesInfoRequestEpic"
import getBcVideosEpic from "./getBcVideosEpic"
import readUsbDirEpic from './readUsbDirEpic'
import getUSBDisksEpic from "./usbDisksRequestEpic";
import getSatelliteEpic from "./satelliteRequestEpic";
import getTimeShiftLimitSizeEpic from "./timeShiftLimitSizeRequestEpic";
import getNotificationEpic from "./notificationRequestEpic";
import getProfileInfoEpic from "./profileInfoRequestEpic";
import getPvrListEpic from "./getPvrListEpic"
import epgSameTimeEpic from "./epgSameTImeEpic"
import getWatchingHistoryEpic from "./watchingHistoryEpic";
import getEPGByGenresEpic from "./epgByGenresRequestEpic";
import getVODByGenresEpic from "./vodByGenresRequestEpic";
import getLatestVODByGenresEpic from "./latestVODByGenresRequestEpic";

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
    getWifiInfoEpic,
    seriesInfoRequestEpic,
    getZapperContentRequestEpic,
    getBcVideosEpic,
    readUsbDirEpic,
    getUSBDisksEpic,
    getSatelliteEpic,
    getTimeShiftLimitSizeEpic,
    getNotificationEpic,
    getProfileInfoEpic,
    getPvrListEpic,
    epgSameTimeEpic,
    getWatchingHistoryEpic,
    getEPGByGenresEpic,
    getVODByGenresEpic,
    getLatestVODByGenresEpic
);

export default rootEpic;