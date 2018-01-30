import Home from './Home'
import {connect} from 'react-redux';
import {getBanner} from '../../actions/getBanner'
import {getChannel} from '../../actions/getChannel'
import {getLive} from '../../actions/getLive'
import {getVOD}from '../../actions/getVOD'

function mapStateToProps(state) {
    return {
        banner: state.bannerReducer,
        channel: state.channelReducer,
        live: state.liveReducer,
        vod: state.vodReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getBanner: () => dispatch(getBanner()),
        getChannel: () => dispatch(getChannel()),
        getLive: () => dispatch(getLive()),
        getVOD: () => dispatch(getVOD())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);