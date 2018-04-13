import {connect} from "react-redux";
import {getZapperContentWithChannelId} from '../../../actions/getZapperContent'
import ZapperContent from './ZapperContent'

function mapStateToProps (state) {
    return {
        content: state.zapperContentReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getZapperContent: (channelId) => dispatch(getZapperContentWithChannelId(channelId)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ZapperContent)