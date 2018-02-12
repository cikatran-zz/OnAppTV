import {connect} from "react-redux";
import actions from '../../actions/index'
import VideoControlModal from './VideoControlModal'

function mapStateToProps (state) {
  return {
    video: state.videoModalReducer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    showVideoModal: (willShow) => dispatch(actions.videoModalAction.showVideoModal(willShow))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoControlModal)