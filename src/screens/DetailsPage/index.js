import {connect} from "react-redux";
import DetailsPage from './DetailsPage'
import { getEpgs, getEpgWithGenres, getEpgWithSeriesId, getVideosInSeriesFromPlaylist } from '../../actions/getEPG'
import { getEpgSameTime } from '../../actions/getEpgSameTime'
import { getVideoOne } from '../../actions/getVideoOne'
import videoOneReducer from '../../reducers/videoOneReducer'

function mapStateToProps(state) {
  return {
    epg: state.epgsReducer,
    epgSameTime: state.epgSameTimeReducer,
    videoOne: state.videoOneReducer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getEpgs: (serviceId, page, perPage) => dispatch(getEpgs(serviceId), page, perPage),
    getEpgWithGenre: (contentId, genresIds, page, perPage) => dispatch(getEpgWithGenres(contentId, genresIds, page, perPage)),
    getEpgWithSeriesId: (contentId, seriesId, page, perPage) => dispatch(getEpgWithSeriesId(contentId, seriesId, page, perPage)),
    getEpgSameTime: (currentTime, channelId) => dispatch(getEpgSameTime(currentTime, channelId)),
    getVideoOne: (contentId) => dispatch(getVideoOne(contentId)),
    getVideosInSeriesFromPlaylist: (contentId, page, perPage) => dispatch(getVideosInSeriesFromPlaylist(contentId, page, perPage))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailsPage)