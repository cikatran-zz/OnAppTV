import {connect} from "react-redux";
import DetailsPage from './DetailsPage'
import { getEpgs, getEpgWithGenres, getEpgWithSeriesId } from '../../actions/getEPG'
import { getEpgSameTime } from '../../actions/getEpgSameTime'

function mapStateToProps(state) {
  return {
    epg: state.epgsReducer,
    epgSameTime: state.epgSameTimeReducer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getEpgs: (serviceId, page, perPage) => dispatch(getEpgs(serviceId), page, perPage),
    getEpgWithGenre: (genresIds, page, perPage) => dispatch(getEpgWithGenres(genresIds, page, perPage)),
    getEpgWithSeriesId: (seriesId, page, perPage) => dispatch(getEpgWithSeriesId(seriesId, page, perPage)),
    getEpgSameTime: (currentTime, channelId) => dispatch(getEpgSameTime(currentTime, channelId))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailsPage)