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
    getEpgs: (channelId) => dispatch(actions.getEpgs.getEpgs(channelId))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoControlModal)