import * as getBanner from './getBanner';
import * as getCategory from './getCategory';
import * as getLive from './getLive'
import * as videoModalAction from './videoModalAction'
import * as getNews from "./getNews";
import * as getEpgs from "./getEPG";
import * as getGenresContent from "./getGenresContent"
import * as getAudioLanguage from "./getAudioLanguage"
import * as getSettings from "./getSettings";
import * as getSubtitles from "./getSubtitles"
import * as getResolution from "./getResolution"
import * as getVideoFormat from "./getVideoFormat"
import * as getWifiInfo from "./getWifiInfo"
import * as getRecordList from './getRecordList'
import * as getSeriesInfo from './getSeriesInfo'
import * as getBcVideos from './getBcVideos'
import * as readUsbDir from './getUsbDir'
import * as getUSBDisks from "./getUSBDisks";
import * as getSatellite from "./getSatellite"
import * as getTimeShiftLimitSize from './getTimeShiftLimitSize'
import * as getNotification from './getNotification'
import * as getProfileInfo from './getProfileInfo'
import * as getPvrList from './getPvrList'
import * as getEpgSameTime from './getEpgSameTime'
import * as getWatchingHistory from './getWatchingHistory'
import * as getEPGByGenres from './getEPGByGenres'
import * as getVODByGenres from './getVODByGenres'
import * as getLatestVODByGenres from './getLatestVODByGenres'
import * as getLiveEpgInZapper from './getLiveEpgInZapper'

export default actions = {
    getBanner,
    getCategory,
    getLive,
    videoModalAction,
    getNews,
    getEpgs,
    getRecordList,
    getAudioLanguage,
    getSettings,
    getSubtitles,
    getResolution,
    getVideoFormat,
    getWifiInfo,
    getGenresContent,
    getSeriesInfo,
    getBcVideos,
    readUsbDir,
    getUSBDisks,
    getSatellite,
    getTimeShiftLimitSize,
    getNotification,
    getProfileInfo,
    getPvrList,
    getEpgSameTime,
    getWatchingHistory,
    getEPGByGenres,
    getVODByGenres,
    getLatestVODByGenres,
    getLiveEpgInZapper
};