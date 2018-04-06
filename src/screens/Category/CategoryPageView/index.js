import {getLive} from "../../../actions/getLive";
import {connect} from "react-redux";
import CategoryPageView from './CategoryPageView'
import {getVOD} from "../../../actions/getVOD";

function mapStateToProps(state) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CategoryPageView);