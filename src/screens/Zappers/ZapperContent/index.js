import {connect} from "react-redux";
import {getZapperContentWithTime} from '../../../actions/getZapperContent'
import ZapperContent from './ZapperContent'

function mapStateToProps (state) {
    return {
        content: state.zapperContentReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getZapperContent: (currentTime) => dispatch(getZapperContentWithTime(currentTime)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ZapperContent)