import BottomTabbar from './BottomTabbar';
import actions from '../../actions'
import {connect} from 'react-redux';

function mapDispatchToProps(dispatch) {
  return {
    showVideoModal: (willShow) => dispatch(actions.videoModalAction.showVideoModal(willShow))
  }
}

export default connect(
  null,
  mapDispatchToProps
)(BottomTabbar);