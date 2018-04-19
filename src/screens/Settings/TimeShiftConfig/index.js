import {connect} from "react-redux";
import TimeShiftConfig from './TimeShiftConfig'
import {getTimeShiftLimitSize} from '../../../actions/getTimeShiftLimitSize'

function mapStateToProps (state) {
    return {
        timeShiftLimitSize: state.timeShiftLimitSizeReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getTimeShiftLimitSize: () => dispatch(getTimeShiftLimitSize())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TimeShiftConfig)