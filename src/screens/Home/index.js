import Home from './Home'
import {connect} from 'react-redux';
import {getBanner} from '../../actions/getBanner'
import {getChannel} from '../../actions/getChannel'
import {getLive} from '../../actions/getLive'

function mapStateToProps(state) {
    return {
        banner: state.bannerReducer,
        channel: state.channelReducer,
        live: state.liveReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getBanner: () => dispatch(getBanner()),
        getChannel: () => dispatch(getChannel()),
        getLive: () => dispatch(getLive())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);