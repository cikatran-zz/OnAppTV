import {connect} from "react-redux";
import actions from '../../actions/index'
import VideoControlModal from './VideoControlModal'

function mapStateToProps (state) {
  return {
    video: state.videoModalReducer,
    bcVideos: state.bcVideosReducer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    showVideoModal: (willShow) => dispatch(actions.videoModalAction.showVideoModal(willShow)),
    getBcVideos: (contentId) => dispatch(actions.getBcVideos.getBcVideos(contentId))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoControlModal)