import React from 'react'
import Swiper from 'react-native-swiper'
import {StyleSheet, View, StatusBar, Platform, NativeModules} from 'react-native'
import {colors} from '../../utils/themeConfig'
import Bookmark from '../Bookmark/Bookmark'
import RecordList from '../RecordList/RecordList'
import {rootViewTopPadding} from '../../utils/rootViewPadding'

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
            (Platform.OS != 'ios') && StatusBar.setBackgroundColor('transparent')
            this.props.getList();
            this.props.getPvrList();
            this.props.getUsbDirFiles('/C/Downloads/');
            NativeModules.STBManager.isConnect((connectStr) => {
                if (JSON.parse(connectStr).is_connected === true) {
                    NativeModules.RNUserKit.getProperty("download_list", (e, arr) => {
                        if (!e) {
                            let downloadedArrFromUserKit = JSON.parse(arr).dataArr
                            this.setState({
                                downloadedArr: downloadedArrFromUserKit
                            })
                        }
                    })
                }
            })
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    _keyExtractor = (item, index) => index

    _renderStatusBar = () => {
        if (Platform.OS === 'ios') {
            return (
                <View style={styles.statusBarWrapView}>
                    <StatusBar
                        translucent={true}
                        backgroundColor='#00000000'
                        barStyle='dark-content'/>
                </View>
            );
        }
        else {
            return (
                    <StatusBar
                        translucent={true}
                        backgroundColor='#ffffff'
                        barStyle='dark-content'/>
            );
        }
    }

    render() {
        const {books, pvrList, usbDirFiles} = this.props
        const {downloadedArr} = this.state

        return (
            <View style={styles.pageViewStyle}>
                {this._renderStatusBar()}
                <Swiper loop={false} horizontal={true} showsPagination={true}
                        removeClippedSubviews={false}>
                    <Bookmark books={books}/>
                    <RecordList header={"MY RECORDS"} position={'inside'} books={books} pvrList={pvrList.data}
                                navigation={this.props.navigation}/>
                    <RecordList header={"MY DOWNLOADS"} position={'inside'} books={books} downloaded={usbDirFiles.data}
                                downloadedUserKit={downloadedArr} navigation={this.props.navigation}/>
                </Swiper>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    pageViewStyle: {
        paddingTop: rootViewTopPadding(),
        backgroundColor: colors.whiteBackground,
        height: '100%',
        width: '100%'
    },
    statusBarWrapView: {
        height: 0,
        backgroundColor: colors.whiteBackground
    }
})