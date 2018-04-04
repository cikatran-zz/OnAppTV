import {connect} from "react-redux";
import actions from '../../actions/index'
import VideoControlModal from './VideoControlModal'

function mapStateToProps (state) {
  return {
    video: state.videoModalReducer,
    epg: state.epgsReducer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    showVideoModal: (willShow) => dispatch(actions.videoModalAction.showVideoModal(willShow)),
    getEpgs: (channelId) => dispatch(actions.getEpgs.getEpgs(channelId)),
    getEpgWithGenre: (genresIds) => dispatch(actions.getEpgs.getEpgWithGenres(genresIds)),
    getEpgWithSeriesId: (seriesId) => dispatch(actions.getEpgs.getEpgWithSeriesId(seriesId))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoControlModal)