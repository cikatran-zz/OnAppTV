import Category from './Category'
import {connect} from 'react-redux';
import {getCategory} from "../../actions/getCategory";

function mapStateToProps(state) {
    return {
        category: state.categoryReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getCategory: ()=> dispatch(getCategory())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Category);