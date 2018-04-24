import Book from './Book'
import {connect} from "react-redux";
import getBookList from '../../actions/getBookList'
import getRecordList from '../../actions/getRecordList'
import { readUsbDir } from '../../actions/getUsbDir'
import { getPvrList } from '../../actions/getPvrList'

function mapStateToProps(state) {
  return {
    books: state.bookListReducer,
    records: state.recordReducer,
    usbDirFiles: state.usbDirReducer,
    pvrList: state.pvrListReducer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getList: () => dispatch(getBookList()),
    getRecordList: () => dispatch(getRecordList()),
    getUsbDirFiles: (dir_path) => dispatch(readUsbDir(dir_path)),
    getPvrList: () => dispatch(getPvrList())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Book);