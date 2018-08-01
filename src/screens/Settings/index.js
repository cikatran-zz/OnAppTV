import {connect} from "react-redux";
import Settings from './Settings'
import {getSettings} from '../../actions/getSettings'
import {getWifiInfo} from "../../actions/getWifiInfo";

function mapStateToProps(state) {
    return {
        settings: state.settingsReducer,
        wifi: state.wifiInfoReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getSettings: () => dispatch(getSettings()),
        getWifiInfo: () => dispatch(getWifiInfo())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Settings)