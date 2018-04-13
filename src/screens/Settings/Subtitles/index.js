import {connect} from "react-redux";
import Subtitles from './Subtitles'
import {getSubtitles} from '../../../actions/getSubtitles'

function mapStateToProps (state) {
    return {
        subtitles: state.subtitlesReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getSubtitles: () => dispatch(getSubtitles())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Subtitles)