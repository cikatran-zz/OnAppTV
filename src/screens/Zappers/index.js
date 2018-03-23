import {connect} from "react-redux";
import {getChannel} from '../../actions/getChannel'
import Zappers from './Zappers'

function mapStateToProps (state) {
    return {
        channel: state.channelReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getChannel: (numberOfItems) => dispatch(getChannel(numberOfItems)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Zappers)