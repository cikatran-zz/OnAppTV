import {connect} from "react-redux";
import AudioLanguage from './AudioLanguage'
import {getAudioLanguage} from '../../../actions/getAudioLanguage'

function mapStateToProps (state) {
    return {
        audioLanguage: state.audioLanguageReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getAudioLanguage: () => dispatch(getAudioLanguage())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AudioLanguage)