import {connect} from "react-redux";
import {getChannel} from '../../../actions/getChannel'
import ZapperChannel from './ZapperChannel'
import {getLiveEpgInZapper} from "../../../actions/getLiveEpgInZapper";

function mapStateToProps (state) {
    return {
        channel: state.channelReducer,
        epg: state.liveEpgInZapperReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getChannel: (numberOfItems) => dispatch(getChannel(numberOfItems)),
        getLiveEpgInZapper: (currentTime, serviceId) => dispatch(getLiveEpgInZapper(currentTime, serviceId))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ZapperChannel)