import {connect} from "react-redux";
import DetailsPage from './DetailsPage'
import { getEpgs, getEpgWithGenres, getEpgWithSeriesId, getVideosInSeriesFromPlaylist } from '../../actions/getEPG'
import { getEpgSameTime } from '../../actions/getEpgSameTime'
import { getVideoOne } from '../../actions/getVideoOne'
import {getLive} from '../../actions/getLive'

function mapStateToProps(state) {
  return {
    epg: state.epgsReducer,
    epgSameTime: state.epgSameTimeReducer,
    videoOne: state.videoOneReducer,
    live: state.liveReducer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getEpgs: (serviceId, startTime, endTime) => dispatch(getEpgs(serviceId, startTime, endTime)),
    getEpgWithGenre: (contentId, genresIds, page, perPage) => dispatch(getEpgWithGenres(contentId, genresIds, page, perPage)),
    getEpgWithSeriesId: (contentId, seriesId, page, perPage) => dispatch(getEpgWithSeriesId(contentId, seriesId, page, perPage)),
    getEpgSameTime: (currentTime, channelId) => dispatch(getEpgSameTime(currentTime, channelId)),
    getVideoOne: (contentId) => dispatch(getVideoOne(contentId)),
    getVideosInSeriesFromPlaylist: (contentId, page, perPage) => dispatch(getVideosInSeriesFromPlaylist(contentId, page, perPage)),
    getLive: (time, page, perPage) => dispatch(getLive(time, page, perPage))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailsPage)