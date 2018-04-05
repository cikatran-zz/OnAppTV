import MyCategories from './MyCategories'
import {connect} from 'react-redux';
import {getCategory} from "../../actions/getCategory";

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
)(MyCategories);