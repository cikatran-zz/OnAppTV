import {connect} from "react-redux";
import Messages from './Messages'
import {getNotification} from "../../../actions/getNotification";

function mapStateToProps(state) {
    return {
        messages: state.notificationReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getMessages: () => dispatch(getNotification()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Messages)