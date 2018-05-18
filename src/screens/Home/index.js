import Home from './Home'
import {connect} from 'react-redux';
import {getBanner} from '../../actions/getBanner'
import {getChannel} from '../../actions/getChannel'
import {getLive} from '../../actions/getLive'
import {getVOD}from '../../actions/getVOD'
import {getAds} from "../../actions/getAds";
import {getCategory} from "../../actions/getCategory";
import {getNews} from "../../actions/getNews";
import {getWatchingHistory} from "../../actions/getWatchingHistory";

function mapStateToProps(state) {
    return {
        banner: state.bannerReducer,
        live: state.liveReducer,
        vod: state.vodReducer,
        ads: state.adsReducer,
        category: state.categoryReducer,
        news: state.newsReducer,
        watchingHistory: state.watchingHistoryReducer,
        channel: state.channelReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getBanner: () => dispatch(getBanner()),
        getLive: (time, page, perPage) => dispatch(getLive(time, page, perPage)),
        getVOD: (page, itemPerPage) => dispatch(getVOD(page, itemPerPage)),
        getAds: () => dispatch(getAds()),
        getCategory: () => dispatch(getCategory()),
        getNews: () => dispatch(getNews()),
        getWatchingHistory: () => dispatch(getWatchingHistory()),
        getChannel: () => dispatch(getChannel())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);