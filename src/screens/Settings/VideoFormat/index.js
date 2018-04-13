import {connect} from "react-redux";
import VideoFormat from './VideoFormat'
import {getVideoFormat} from '../../../actions/getVideoFormat'

function mapStateToProps (state) {
    return {
        videoFormat: state.videoFormatReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getVideoFormat: () => dispatch(getVideoFormat())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VideoFormat)