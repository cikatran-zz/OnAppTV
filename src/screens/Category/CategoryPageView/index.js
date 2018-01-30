import {getLive} from "../../../actions/getLive";
import {connect} from "react-redux";
import CategoryPageView from './CategoryPageView'

function mapStateToProps(state) {
    return {
        live: state.liveReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getLive: ()=> dispatch(getLive())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CategoryPageView);