import Category from './Category'
import {connect} from 'react-redux';
import {getGenresContent} from "../../actions/getGenresContent";
import {getEPGByGenres} from "../../actions/getEPGByGenres";
import {getVODByGenres} from "../../actions/getVODByGenres";

function mapStateToProps(state) {
    return {
        genresContent: state.genresContentReducer,
        epg: state.epgByGenresReducer,
        vod: state.vodByGenresReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getGenresContent: (genresIds)=> dispatch(getGenresContent(genresIds)),
        getEPG: (limit, skip, genresId, currentTime) => dispatch(getEPGByGenres(limit, skip, genresId, currentTime)),
        getVODByGenres: (page, perPage, genresId) => dispatch(getVODByGenres(page, perPage, genresId))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Category);