import MyCategories from './MyCategories'
import {connect} from 'react-redux';
import {updateFavorite} from "../../actions/updateFavorite";

function mapStateToProps(state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateFavorite: (favorites) => dispatch(updateFavorite(favorites))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyCategories);