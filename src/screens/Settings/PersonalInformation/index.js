import {connect} from "react-redux";
import PersonalInformation from './PersonalInformation'
import {getProfileInfo} from "../../../actions/getProfileInfo";

function mapStateToProps(state) {
    return {
        profile: state.profileInfoReducer,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getProfile: () => dispatch(getProfileInfo()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PersonalInformation)