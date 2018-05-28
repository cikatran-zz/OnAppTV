import React from 'react'
import {
    Animated,
    Dimensions,
    Image,
    ImageBackground,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    NativeModules,
    NativeEventEmitter,
    Share,
    View,
    PanResponder,
    Platform, StatusBar
} from 'react-native'
import {colors} from '../../utils/themeConfig'
import Orientation from 'react-native-orientation';
import BrightcovePlayer from "../../components/BrightcovePlayer";
import VolumeSeeker from "../../components/VolumeSeeker"
import LowerPagerComponent from "../DetailsPage/DetailsPage"
import BlurView from '../../components/BlurView'
import ControlModal from '../../components/ControlModal'
import {getBlurRadius} from '../../utils/blurRadius'
import {secondFormatter} from '../../utils/timeUtils'
import Swiper from 'react-native-swiper'
import PinkRoundedButton from '../../components/PinkRoundedLabel'
import {rootViewTopPadding} from '../../utils/rootViewPadding'
import moment from 'moment';
import AlertModal from '../../components/AlertModal'
const { RNBrightcoveVC } = NativeModules;
import _ from 'lodash'

const brightcoveVCEmitter = new NativeEventEmitter(RNBrightcoveVC);

const {width, height} = Dimensions.get("window")
export default class VideoControlModal extends React.Component {

    onLayout(e) {
        const {width, height} = Dimensions.get("window")
        if (width > height) {
            !(Platform.OS === "ios") && this.setState({
                showBrightcove: true
            });
            const {item} = this.props.navigation.state.params
            if (item) {
                let videoId = item.contentId ? item.contentId : '5714823997001';
                console.log("BRIGHTCOVE", NativeModules.RNBrightcoveVC);
                NativeModules.RNBrightcoveVC.navigateWithVideoId(videoId, '5706818955001', 'BCpkADawqM13qhq60TadJ6iG3UAnCE3D-7KfpctIrUWje06x4IHVkl30mo-3P8b7m6TXxBYmvhIdZIAeNlo_h_IfoI17b5_5EhchRk4xPe7N7fEVEkyV4e8u-zBtqnkRHkwBBiD3pHf0ua4I',{}, this.currentPlayHead);
            }
        }
        else {
            !(Platform.OS === "ios") && this.setState({
                showBrightcove: false
            })
        }
    }

    _showAlertModal = () => {
        console.log(this.alertModal.state.isShow)
        if (!this.alertModal.state.isShow) {
            this.alertModal.setState({isShow: true, message: "Rotate your device to watch on the phone!"})
        }
    }

    _showDownloadModal = () => {
        if (!this.alertModal.state.isShow) {
            this.alertModal.setState({isShow: true, message: "Sign in to download videos"})
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            showBrightcove: false,
            recordEnabled: false,
            favoriteEnabled: false,
            modalVisibility: false,
            modalRecordTarget: "none",
            modalFavoriteTarget: "none",
            passTime: 0,
            etrTime: 0,
            volume: 0,
            index: -1,
            isScrollEnabled: true

        };

        this.alertModal = null;
        this.showingBrightcove = false
        this.subscription = null;
        this.currentPlayHead = 0
    }

    componentWillMount() {
    }

    componentWillUnmount() {
        Orientation.removeSpecificOrientationListener(this._orientationDidChange)
        this._navListener.remove();
        this.subscription.remove();
    }

    componentWillReceiveProps(nextProps) {

        let bcVideos = nextProps.bcVideos;

        console.log("BRIGHTCOVE",bcVideos.data);

        if (bcVideos && bcVideos.data) {

            if (!bcVideos.isFetching) {

                let progressJson = {
                    url: bcVideos.data.sources.filter(x => {
                        return !!x.container
                    })[0].src,
                    destination_path: '/C/Downloads'
                }
            }
        }
    }

    componentDidMount() {
        const {item, epg} = this.props.navigation.state.params;
        let itemIndex = epg.findIndex(x => x.title ? x.title === item.title && x.durationInSeconds === item.durationInSeconds : x.channelData.lcn === item.channelData.lcn);
        this.setState({
            index: itemIndex
        });

        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('light-content');
            (Platform.OS !== 'ios') && StatusBar.setBackgroundColor('transparent');
        });

        NativeModules.STBManager.isConnect((connectStr) => {
            let json = JSON.parse(connectStr).is_connected
            this.setState({isConnected: json})
        });

        this.setState({
            currentTime: new Date().getTime(),
            startPoint: new Date().getTime()
        });
        Orientation.unlockAllOrientations();
        Orientation.addSpecificOrientationListener(this._orientationDidChange);

        this.subscription = brightcoveVCEmitter.addListener('DismissBrightcove', (event)=> {
            this.showingBrightcove = false;
        });
    }

    _orientationDidChange = (orientation) => {

        if (orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT') {
            !(Platform.OS === "ios") && this.setState({showBrightcove: true});
            const {epg} = this.props.navigation.state.params;
            let it = epg[this.state.index];
            if (it && this.showingBrightcove === false) {
                let videoId = it.contentId ? it.contentId : '5714823997001';
                this.showingBrightcove = true;
                RNBrightcoveVC.navigateWithVideoId(videoId, '5706818955001', 'BCpkADawqM13qhq60TadJ6iG3UAnCE3D-7KfpctIrUWje06x4IHVkl30mo-3P8b7m6TXxBYmvhIdZIAeNlo_h_IfoI17b5_5EhchRk4xPe7N7fEVEkyV4e8u-zBtqnkRHkwBBiD3pHf0ua4I', {}, this.currentPlayHead);
            }
        }
    };

    _onRecordPress = () => this._toggleModal('record')

    _onFavouritePress = () => this._toggleModal('favorite')

    _getRecordStartMargin = (startTime, endTime) => {
        const {startPoint} = this.state;
        let durationInSeconds = (new Date(endTime)).getTime() - (new Date(startTime)).getTime()
        let passedTime = startPoint - (new Date(startTime)).getTime();
        return (passedTime / durationInSeconds) * 100
    }

    _getRecordProgress = (currentTime, startTime, endTime) => {
        const {startPoint} = this.state;
        let durationInSeconds = (new Date(endTime)).getTime() - (new Date(startTime)).getTime()
        let recordedTime = (((currentTime - startPoint) / durationInSeconds) * 100)
        if (recordedTime <= 1) return '1%'
        else return recordedTime + "%"
    }

    _playMediaControl = (bcVideos) => {
        if (bcVideos.data) {
        }
    }

    _renderRecordBar = (isLive, startTime, endTime) => {
        const {currentTime} = this.state
        if (isLive) {
            let marginLeft = this._getRecordStartMargin(startTime, endTime) <= 0 ? '3%' : this._getRecordStartMargin(startTime, endTime) + "%"
            let width = this._getRecordProgress(currentTime, startTime, endTime)
            return (
                <View style={[styles.recordBar, {left: marginLeft, width: width}]}/>
            )
        }
        else return null
    }

    _informationPress = (item, epg, isLive) => {
        this.props.navigation.replace('DetailsPage', {
            item: epg[this.state.index < 0 ? 0 : this.state.index],
            epg: epg.data,
            isLive: isLive
        })
    }

    _keyExtractor = (item, index) => index;

    _onSwiperIndexChanged = (index) => {
        const {item, isLive, epg} = this.props.navigation.state.params
        if (!isLive) {
            let itemContentId = epg[index].contentId
            if (Number.parseInt(itemContentId) === +itemContentId) {
                this.props.getBcVideos(epg[index].contentId)
            }
        }
        this.setState({
            index: index
        });
    }

    _onAlertModal = (event) => {
        this.alertModal.setState({isShow: true, message: event.nativeEvent.message})
    };


    _renderModal = () => {
        const {item, epg, isLive} = this.props.navigation.state.params;
        const {bcVideos} = this.props;
        let itemIndex = epg.findIndex(x => x.title ? x.title === item.title && x.durationInSeconds === item.durationInSeconds : x.channelData.lcn === item.channelData.lcn);
        let url = '';

        if (bcVideos.data != null) {
            let url = bcVideos.data.sources.filter(x => {
                return !!x.container
            })[0].src
        }

        return (
            <ControlModal style={{width: '100%', height: '100%', backgroundColor: 'black'}}
                          items={epg}
                          index={itemIndex}
                          isLive={isLive}
                          onClose={() => this.props.navigation.goBack()}
                          onDetail={()=>this._informationPress(item, epg, isLive)}
                          onAlert={(event)=>this._onAlertModal(event)}
                          onShare={(event)=>this._shareExecution(event.nativeEvent)}
                          onIndexChanged={(event)=>this._onSwiperIndexChanged(event.nativeEvent.index)}
                          onBookmark={this._onRecordPress}
                          onFavorite={this._onFavouritePress}
                          onProgress={(event)=> this.currentPlayHead = event.nativeEvent.current}/>
        )

    }

    _toggleModal = (actionType) => {
        const {item} = this.props.navigation.state.params

        if (item.type === 'Episode') {
            this.setState({
                modalVisibility: !this.state.modalVisibility,
                modalContent: actionType
            })
        }
        else {
            const {recordEnabled, favoriteEnabled} = this.state

            if (actionType === 'record') {
                if (item.type === 'Standalone') {
                    NativeModules.RNUserKitIdentity.checkSignIn((error, result) => {
                        let isSignIn = JSON.parse(result[0]).is_sign_in
                        if (isSignIn) {
                            if (recordEnabled) {
                                // Stop downloading current item
                                this.stopDownload()
                            }
                            else {
                                // Start or resume downloading current item
                                this._downloadExecution()
                            }
                            this.setState({
                                recordEnabled: !recordEnabled
                            })
                        }
                        else {
                            this._showDownloadModal()
                        }
                    })

                }
                else {
                    if (recordEnabled) {
                        // Stop recording current channel
                        this._stopRecord()
                    }
                    else {
                        // Start recording
                        this._bookExecution(item)
                    }

                    this.setState({
                        recordEnabled: !recordEnabled
                    })
                }


            }
            else {
                // Use Userkit

                this.setState({
                    favoriteEnabled: !favoriteEnabled
                })
            }
        }
    }

    _stopRecord = () => {
        NativeModules.STBManager.recordPvrStopInJson((error, events) => {
            console.log(events[0])
        })
    }

    stopDownload = () => {
        const {bcVideos} = this.props

        if (bcVideos && bcVideos.data) {

            let json = {
                remove_flag: 1,
                contentId: bcVideos.data.contentId,
                url: bcVideos.data.sources.filter(x => {
                    return !!x.container
                })[0].src,
                destination_path: "/C/Downloads"
            }
            NativeModules.STBManager.mediaDownloadStopWithJson(JSON.stringify(json), (error, events) => {
                if (JSON.parse(events[0]).return === 1) {
                    let downloadList = []
                    NativeModules.RNUserKit.getProperty("download_list", (err, obj) => {
                        downloadList = downloadList.concat(JSON.parse(obj).dataArr)
                        downloadList.splice(downloadList.indexOf(downloadList.filter(x => x.contentId === json.contentId)[0]), 1)
                        NativeModules.RNUserKit.storeProperty("download_list", {dataArr: downloadList}, (e, r) => {
                        })
                    })
                }
                else {
                    console.log('Stop download failure!')
                    console.log(json)
                }
            })
        }
    }

    _downloadExecution = () => {
        const {epg, item} = this.props.navigation.state.params
        const {bcVideos} = this.props
        const {index} = this.state

        let videoData = index === -1 ? item : epg[index]

        if (bcVideos && bcVideos.data) {
            let json = {
                contentId: bcVideos.data.contentId,
                url: bcVideos.data.sources.filter(x => {
                    return !!x.container
                })[0].src,
                destination_path: "/C/Downloads"
            }

            console.log('Download Json')
            console.log(json)

            NativeModules.STBManager.mediaDownloadStartWithJson(JSON.stringify(json), (error, events) => {
                let result = JSON.parse(events[0]).return
                console.log('Download result of id %s is %s', bcVideos.data.contentId, result)
                if (result === "1") {
                    // Start download successfully
                    // Add to userkit
                    let pattern = /[a-zA-Z0-9]*\.mp4/

                    let downloadList = []
                    NativeModules.RNUserKit.getProperty("download_list", (err, obj) => {
                        downloadList = downloadList.concat(JSON.parse(obj).dataArr ? JSON.parse(obj).dataArr : [])

                        let newData = {
                            ...videoData,
                            ...json,
                            fileName: pattern.exec(json.url)[0]
                        }

                        let params = downloadList.concat([newData])

                        NativeModules.RNUserKit.storeProperty("download_list", {dataArr: params}, (e, r) => {
                        })
                    })
                }
                else console.log(result)
            })
        }
    }

    _simpleDataFormat = (time) => {
        return moment(time).format("YYYY-MM-DD hh:mm:ss")
    }

    _bookExecution = (liveItem) => {
        let durationInSeconds = Math.round((new Date(liveItem.endTime).getTime() - new Date(liveItem.startTime).getTime()) / 1000);

        let genresData = liveItem.videoData.genresData;
        if (genresData == null) {
            genresData = liveItem.videoData.genres;
        }
        let jsonString = {
            "record_parameter": {
                "startTime": this._simpleDataFormat(liveItem.startTime),
                "recordMode": 1,
                "recordName": liveItem.videoData.title,
                "lCN": liveItem.channelData.lcn,
                "duration": durationInSeconds

            },
            "metaData": {
                "endtime": liveItem.endTime,
                "starttime": liveItem.startTime,
                "title": liveItem.videoData.title,
                "image": liveItem.videoData.originalImages[0].url,
                "subTitle": genresData.length > 0 ? genresData[0].name : ""
            }
        }

        console.log('JSON String for record')
        console.log(JSON.stringify(jsonString))

        NativeModules.STBManager.recordPvrStartWithJsonString(JSON.stringify(jsonString), (error, events) => {
            console.log('Record start')
            console.log(events)
        })
    }

    _onChangeScrollEnabled = (isEnabled) => {
        this.setState({isScrollEnabled: isEnabled})
    };

    _shareExecution = (event) => {
        let content = {
            message: event.message,
            title: event.title,
            url: event.url
        };
        Share.share(content, {})
    };

    _onModalButtonPress = (actionType, secondActionType) => {
        const {recordEnabled, favoriteEnabled, modalRecordTarget, modalFavoriteTarget} = this.state

        if (actionType === 'record') {
            if (recordEnabled) {
                // Stop downloading case
                if (secondActionType === 'item') {
                    console.log('Stop downloading item')
                    // Stop downloading current item
                }
                else {
                    // Update Userkit variable to remove series from downloading
                    console.log('Stop downloading series')
                }
            }
            else {
                // Start downloading current item

                if (secondActionType === 'series') {
                    // Start query all VOD video with seriesId and downloading one by one. Save seriesId into Userkit variable as a list of download with type : series
                    // List structure
                    /*
                      [
                        {
                          type: "series",
                          id: seriesId or contentId
                        }
                      ]
                     */
                    console.log('Start downloading series')

                }
                else {
                    // Downloading current item
                    console.log('Start downloading item')

                }

            }
            this.setState({
                recordEnabled: modalRecordTarget !== secondActionType,
                modalRecordTarget: modalRecordTarget === secondActionType ? "none" : secondActionType
            })
        }
        else {
            // Use Userkit

            this.setState({
                favoriteEnabled: modalFavoriteTarget !== secondActionType,
                modalFavoriteTarget: modalFavoriteTarget === secondActionType ? "none" : secondActionType
            })
        }
    }

    _renderRecordModal = () => {
        const {modalContent, modalRecordTarget, modalFavoriteTarget} = this.state
        const {isLive} = this.props.navigation.state.params

        let img = modalContent === 'record' ? require('../../assets/ic_record_black_border.png') : require('../../assets/ic_heart_black_border.png')
        let firstButtonImg
        let secondButtonImg

        if (this.state.modalContent === 'record') {
            firstButtonImg = modalRecordTarget === 'item' ? colors.mainPink : 'transparent'
            secondButtonImg = modalRecordTarget === 'series' ? colors.mainPink : 'transparent'
        }
        else {
            firstButtonImg = modalFavoriteTarget === 'item' ? colors.mainPink : 'transparent'
            secondButtonImg = modalFavoriteTarget === 'series' ? colors.mainPink : 'transparent'
        }

        const {item} = this.props.navigation.state.params
        const {seriesInfo} = this.props;

        let iconUrl = ''
        if (item.originalImages && item.originalImages.length > 0) {
            iconUrl = item.originalImages[0].url
        }

        if (item.type === 'Episode') {
            return (
                <Modal animationType={'fade'} transparent={true}
                       visible={this.state.modalVisibility} onRequestClose={() => console.log('close')}>
                    <View style={styles.modal}>
                        <BlurView blurRadius={getBlurRadius(30)} style={styles.modalBlurView} overlayColor={1}/>
                        <TouchableOpacity style={styles.close} onPress={() => this._toggleModal()}>
                            <Image source={require('../../assets/ic_modal_close.png')}/>
                        </TouchableOpacity>
                        <View style={styles.modalInsideContainer}>
                            <Image source={{uri: iconUrl}} style={styles.modalImage}/>
                            <Text style={styles.modalTitleText}>{item.title}</Text>
                            <Text style={styles.modalShortDes}>{"Series - Episode " + item.seasonIndex}</Text>
                            <Text style={styles.modalLongDes}>{item.longDescription}</Text>
                            <View style={{flexDirection: 'row', marginBottom: '11%', marginTop: 'auto'}}>
                                <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}
                                                  onPress={() => this._onModalButtonPress(this.state.modalContent, 'item')}>
                                    <View style={{
                                        width: 40,
                                        height: 40,
                                        marginRight: 7,
                                        backgroundColor: firstButtonImg,
                                        borderRadius: 20
                                    }}>
                                        <Image source={img} style={styles.buttonIconStyle}/>
                                    </View>
                                    <Text>{"Episode " + item.seasonIndex}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginLeft: 11}}
                                                  onPress={() => this._onModalButtonPress(this.state.modalContent, 'series')}>
                                    <View style={{
                                        width: 40,
                                        height: 40,
                                        marginRight: 7,
                                        backgroundColor: secondButtonImg,
                                        borderRadius: 20
                                    }}>
                                        <Image source={img} style={styles.buttonIconStyle}/>
                                    </View>
                                    <Text>{_.get(seriesInfo, 'data', null) ? seriesInfo.data.title : ""}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )
        }
        else return null
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor='#00000000'
                    barStyle='light-content'/>
                <AlertModal ref={(modal) => {
                    this.alertModal = modal
                }}/>
                {this._renderRecordModal()}
                {this._renderModal()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    pageViewStyle: {
        backgroundColor: colors.screenBackground
    },
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    topContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '42%',
        width: '100%',
        flexDirection: 'column'
    },
    modal: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'transparent',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    modalBlurView: {
        width: '100%',
        height: '100%'
    },
    close: {
        position: 'absolute',
        top: 6 + rootViewTopPadding(),
        right: 20
    },
    modalButtonText: {
        fontSize: 12,
        color: colors.greyParentalControl
    },
    modalInsideContainer: {
        position: 'absolute',
        width: '75%',
        height: '60%',
        backgroundColor: colors.whitePrimary,
        top: '17.5%',
        left: '12.5%',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 13
    },
    modalImage: {
        marginTop: 50,
        width: '55%',
        height: '19%',
        alignSelf: 'center',
        borderRadius: 4
    },
    modalTitleText: {
        marginTop: 15,
        fontSize: 15,
        color: 'black',
        textAlign: 'center'
    },
    modalShortDes: {
        fontSize: 12,
        color: colors.greyParentalControl,
        textAlign: 'center',
        marginTop: 4
    },
    modalLongDes: {
        fontSize: 12,
        color: colors.greyParentalControl,
        textAlign: 'center',
        marginTop: 11,
        marginLeft: 37,
        marginRight: 37
    },
    bottomContainer: {
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        alignItems: 'center'
    },
    topVideoControl: {
        width: '100%',
        height: '100%'
    },
    bottomVideoControl: {
        aspectRatio: 1.3,
        height: '100%'
    },
    blurView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%',
    },
    pageContainer: {
        width: width,
        height: height,
        flexDirection: 'column'
    },
    blurOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100%',
        backgroundColor: colors.greyOpacityBackground
    },
    buttonContainer: {
        width: 44,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonIcon: {
        width: 17,
        height: 17
    },
    playbackContainer: {
        position: 'absolute',
        top: '42%',
        left: 0,
        width: '100%',
        height: '58%',
        flexDirection: 'column'
    },
    topButtonsContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        width: '72.5%',
        justifyContent: 'space-between',
        height: '11%'
    },
    mediaInfoContainer: {
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
        marginTop: '8%',
    },
    titleText: {
        color: colors.whitePrimary,
        fontSize: 16,
        alignSelf: 'center',
        textAlign: 'center',
        marginStart: 30,
        marginEnd: 30
    },
    typeText: {
        color: colors.whitePrimary,
        opacity: 0.46,
        fontSize: 12
    },
    playbackButtons: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '7%',
        height: '21%'
    },
    rewindButton: {
        width: '9%',
        height: '30%',
        marginRight: '11%'
    },
    fastForwardButton: {
        marginLeft: '11%',
        width: '9%',
        height: '30%',
    },
    volumeSeekBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: '7%'
    },
    volumeLessIcon: {
        marginRight: 5,
        width: 7,
        height: 10
    },
    volumeMoreIcon: {
        marginLeft: 5,
        width: 17,
        height: 15
    },
    dragContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonStyle: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    buttonIconStyle: {
        resizeMode: 'contain',
        width: '98%',
        height: '98%',
        alignSelf: 'center'
    },
    passedText: {
        marginLeft: 20,
        fontSize: 12,
        color: colors.whitePrimary
    },
    etrText: {
        marginRight: 20,
        fontSize: 12,
        color: colors.whitePrimary
    },
    recordBar: {
        height: 3,
        position: 'absolute',
        bottom: 0,
        backgroundColor: colors.mainPink
    },
    infoImage: {
        width: 27,
        height: 27,
        resizeMode: 'cover'
    },
    vodProgressStyle: {
        height: '100%',
        backgroundColor: 'rgba(17,17,19,0.45)',
        position: 'absolute',
        top: 0,
        left: 0
}
})

const jsonString = "{\n" +
    "      \"url\": \"http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4\",\n" +
    "      \"playPosition\": 0\n" +
    "    }"


