import Home from './Home'
import {connect} from 'react-redux';
import {getBanner} from '../../actions/getBanner'
function mapStateToProps (state) {
  return {
    banner: state.bannerReducer,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getBanner: () => dispatch(getBanner()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);