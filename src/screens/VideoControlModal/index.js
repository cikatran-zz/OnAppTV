import {connect} from "react-redux";
import actions from '../../actions/index'
import VideoControlModal from './VideoControlModal'
import {updateWatchingHistory} from "../../actions/watchingHistory";

function mapStateToProps(state) {
    return {
        video: state.videoModalReducer,
        bcVideos: state.bcVideosReducer,
        watchingHistory: state.watchingHistoryReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        showVideoModal: (willShow) => dispatch(actions.videoModalAction.showVideoModal(willShow)),
        getBcVideos: (contentId) => dispatch(actions.getBcVideos.getBcVideos(contentId)),
        updateWatchingHistory: (watchingHistory, id, consumedLength) => dispatch(updateWatchingHistory(watchingHistory, id, consumedLength, dispatch))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VideoControlModal)