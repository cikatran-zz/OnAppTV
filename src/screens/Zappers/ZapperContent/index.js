import {connect} from "react-redux";
import {getZapperContentWithTime} from '../../../actions/getZapperContent'
import ZapperContent from './ZapperContent'
import { getChannel } from '../../../actions/getChannel'

function mapStateToProps (state) {
    return {
      channel: state.channelReducer,
      content: state.zapperContentReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
      getChannel: (numberOfItems) => dispatch(getChannel(numberOfItems)),
      getZapperContent: (currentTime) => dispatch(getZapperContentWithTime(currentTime)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ZapperContent)