import {getLive} from "../../../actions/getLive";
import {connect} from "react-redux";
import CategoryPageView from './CategoryPageView'
import {getVOD} from "../../../actions/getVOD";

function mapStateToProps(state) {
    return {
        live: state.liveReducer,
        vod: state.vodReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getLive: ()=> dispatch(getLive()),
        getVOD: ()=>dispatch(getVOD())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CategoryPageView);