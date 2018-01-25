import Home from './Home'
import {connect} from 'react-redux';
import {getBanner} from '../../actions/getBanner'
import {getChannel} from '../../actions/getChannel'

function mapStateToProps(state) {
    return {
        banner: state.bannerReducer,
        channel: state.channelReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getBanner: () => dispatch(getBanner()),
        getChannel: () => dispatch(getChannel()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);