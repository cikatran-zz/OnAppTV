import Book from './Book'
import {connect} from "react-redux";
import getBookList from '../../actions/getBookList'
import getRecordList from '../../actions/getRecordList'

function mapStateToProps(state) {
  return {
    books: state.bookListReducer,
    records: state.recordReducer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getList: () => dispatch(getBookList()),
    getRecordList: () => dispatch(getRecordList())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Book);