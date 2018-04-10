import {connect} from "react-redux";
import Settings from './Settings'
import {getSettings} from '../../actions/getSettings'

function mapStateToProps(state) {
    return {
        settings: state.settingsReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getSettings: () => dispatch(getSettings())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Settings)