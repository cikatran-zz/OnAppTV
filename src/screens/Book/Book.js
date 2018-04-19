import React from 'react'
import Swiper from 'react-native-swiper'
import { StyleSheet, View, StatusBar, Platform, NativeModules } from 'react-native'
import {colors} from '../../utils/themeConfig'
import Bookmark from '../Bookmark/Bookmark'
import RecordList from '../RecordList/RecordList'
import {rootViewTopPadding} from '../../utils/rootViewTopPadding'

export default class Book extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      downloadedArr: []
    }
  }

  componentDidMount() {


      this._navListener = this.props.navigation.addListener('didFocus', () => {
          StatusBar.setBarStyle('dark-content');
          (Platform.OS != 'ios') && StatusBar.setBackgroundColor('transparent');
        this.props.getList();
        this.props.getUsbDirFiles('/C/Downloads')
        NativeModules.RNUserKit.getProperty("download_list", (e, arr) => {
          let downloadedArrFromUserKit = JSON.parse(arr).dataArr
          this.setState({
            downloadedArr: downloadedArrFromUserKit
          })
        })
      });
  }

  componentWillUnmount() {
      this._navListener.remove();
  }

  _keyExtractor = (item, index) => index

  render() {
    const {books, usbDirFiles} = this.props
    const {downloadedArr} = this.state

    return (
      <View style={{width: '100%', height: '100%'}}>
          <StatusBar
              translucent={true}
              backgroundColor='#00000000'
              barStyle='dark-content'/>
        <Swiper loop={false} horizontal={true} showsPagination={true} style={styles.pageViewStyle} removeClippedSubviews={false}>
          <Bookmark books={books}/>
          <RecordList header={"MY RECORDS"} books={books}/>
          <RecordList header={"MY DOWNLOADS"} books={books} downloaded={usbDirFiles} downloadedUserKit={downloadedArr} navigation={this.props.navigation}/>
        </Swiper>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  pageViewStyle: {
    paddingTop: rootViewTopPadding(),
    backgroundColor: colors.screenBackground
  }
})