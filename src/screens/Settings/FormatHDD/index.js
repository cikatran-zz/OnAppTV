import {connect} from "react-redux";
import FormatHDD from './FormatHDD'
import {getUSBDisks} from '../../../actions/getUSBDisks'

function mapStateToProps (state) {
    return {
        usbDisks: state.usbDisksReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getUSBDisks: () => dispatch(getUSBDisks())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FormatHDD)