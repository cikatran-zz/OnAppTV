import RecordList from './RecordList'
import {connect} from "react-redux";
import getRecordList from '../../actions/getRecordList'
import { readUsbDir } from '../../actions/getUsbDir'

function mapStateToProps(state) {
  return {
    records: state.recordReducer,
    usbDirFiles: state.usbDirReducer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getRecordList: () => dispatch(getRecordList()),
    getUsbDirFiles: (dir_path) => dispatch(readUsbDir(dir_path))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordList);