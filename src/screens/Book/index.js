import Book from './Book'
import {connect} from "react-redux";
import getBookList from '../../actions/getBookList'
import bookListReducer from '../../reducers/bookListReducer'

function mapStateToProps(state) {
  return {
    books: state.bookListReducer
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
)(Book);