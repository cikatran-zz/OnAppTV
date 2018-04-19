import {connect} from "react-redux";
import AtennaTests from './AtennaTests'
import {getSatellite} from '../../../actions/getSatellite'

function mapStateToProps (state) {
    return {
        satellite: state.satelliteReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getSatellite: () => dispatch(getSatellite())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AtennaTests)