import Home from './Home'
import {connect} from 'react-redux';
import {getBanner} from '../../actions/getBanner'
import {getChannel} from '../../actions/getChannel'
import {getLive} from '../../actions/getLive'
import {getVOD}from '../../actions/getVOD'
import {getAds} from "../../actions/getAds";
import {getCategory} from "../../actions/getCategory";
import {getNews} from "../../actions/getNews";

function mapStateToProps(state) {
    return {
        banner: state.bannerReducer,
        channel: state.channelReducer,
        live: state.liveReducer,
        vod: state.vodReducer,
        ads: state.adsReducer,
        category: state.categoryReducer,
        news: state.newsReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getBanner: () => dispatch(getBanner()),
        getChannel: (numberOfItems) => dispatch(getChannel(numberOfItems)),
        getLive: (time) => dispatch(getLive(time)),
        getVOD: (page, itemPerPage) => dispatch(getVOD(page, itemPerPage)),
        getAds: () => dispatch(getAds()),
        getCategory: () => dispatch(getCategory()),
        getNews: () => dispatch(getNews())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);