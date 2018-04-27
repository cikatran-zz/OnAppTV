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
    getEpgs: (serviceId) => dispatch(getEpgs(serviceId)),
    getEpgWithGenre: (genresIds) => dispatch(getEpgWithGenres(genresIds)),
    getEpgWithSeriesId: (seriesId) => dispatch(getEpgWithSeriesId(seriesId)),
    getEpgSameTime: (currentTime, channelId) => dispatch(getEpgSameTime(currentTime, channelId))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailsPage)