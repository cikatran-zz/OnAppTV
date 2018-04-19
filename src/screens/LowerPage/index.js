import {connect} from "react-redux";
import LowerPageComponent from './LowerPageComponent'
import { getEpgs, getEpgWithGenres, getEpgWithSeriesId } from '../../actions/getEPG'

function mapStateToProps(state) {
  return {
    epg: state.epgsReducer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getEpgs: (serviceId) => dispatch(getEpgs(serviceId)),
    getEpgWithGenre: (genresIds) => dispatch(getEpgWithGenres(genresIds)),
    getEpgWithSeriesId: (seriesId) => dispatch(getEpgWithSeriesId(seriesId))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LowerPageComponent)