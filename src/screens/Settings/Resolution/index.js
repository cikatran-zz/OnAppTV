import {connect} from "react-redux";
import Resolution from './Resolution'
import {getResolution} from '../../../actions/getResolution'

function mapStateToProps (state) {
    return {
        resolution: state.resolutionReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getResolution: () => dispatch(getResolution())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Resolution)