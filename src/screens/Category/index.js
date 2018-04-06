import Category from './Category'
import {connect} from 'react-redux';
import {getGenresContent} from "../../actions/getGenresContent";

function mapStateToProps(state) {
    return {
        genresContent: state.genresContentReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getGenresContent: (genresIds)=> dispatch(getGenresContent(genresIds))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Category);