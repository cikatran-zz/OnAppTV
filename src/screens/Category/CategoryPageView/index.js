import {connect} from "react-redux";
import CategoryPageView from './CategoryPageView'
import {getLatestVODByGenres} from "../../../actions/getLatestVODByGenres";
import {getEPGByGenres} from "../../../actions/getEPGByGenres";
import {getVODByGenres} from "../../../actions/getVODByGenres";

function mapStateToProps(state) {
    return {
        latestVOD: state.latestVODByGenresReducer,
        epg: state.epgByGenresReducer,
        vod: state.vodByGenresReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getLatestVOD: (genresId)=> dispatch(getLatestVODByGenres(genresId)),
        getEPG: (limit, skip, genresId, currentTime) => dispatch(getEPGByGenres(limit, skip, genresId, currentTime)),
        getVODByGenres: (page, perPage, genresId) => dispatch(getVODByGenres(page, perPage, genresId))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CategoryPageView);