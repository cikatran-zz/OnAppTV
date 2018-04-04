import Bookmark from './Bookmark'
import {connect} from "react-redux";
import getBookList from '../../actions/getBookList'

function mapStateToProps(state) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return {
    getList: () => dispatch(getBookList())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
) (Bookmark);