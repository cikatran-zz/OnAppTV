import Book from './Book'
import {connect} from "react-redux";
import getBookList from '../../actions/getBookList'
import getRecordList from '../../actions/getRecordList'
import { readUsbDir } from '../../actions/getUsbDir'

function mapStateToProps(state) {
  return {
    books: state.bookListReducer,
    records: state.recordReducer,
    usbDirFiles: state.usbDirReducer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getList: () => dispatch(getBookList()),
    getRecordList: () => dispatch(getRecordList()),
    getUsbDirFiles: (dir_path) => dispatch(readUsbDir(dir_path))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Book);