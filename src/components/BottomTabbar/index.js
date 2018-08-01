import BottomTabbar from './BottomTabbar';
import actions from '../../actions'
import {connect} from 'react-redux';

function mapStateToProps (state) {
    return {
      connectStatus: state.connectStatusReducer
    }
}

function mapDispatchToProps(dispatch) {
  return {
      showVideoModal: (willShow) => dispatch(actions.videoModalAction.showVideoModal(willShow)),
      setStatusConnected: () => dispatch(actions.getConnectStatus.setStatusConnected()),
      setStatusDisconnected: () => dispatch(actions.getConnectStatus.setStatusDisconnected())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BottomTabbar);