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
  Share,
  View,
  PanResponder
} from 'react-native'
import {colors} from '../../utils/themeConfig'
import Orientation from 'react-native-orientation';
import VolumeSeeker from "../../components/VolumeSeeker"
import BlurView from '../../components/BlurView'
import {getBlurRadius} from '../../utils/blurRadius'
import {secondFormatter} from '../../utils/timeUtils'
import Swiper from 'react-native-swiper'
import { rootViewTopPadding } from '../../utils/rootViewPadding'
import moment from 'moment';
import AlertModal from '../../components/AlertModal'

const {width, height} = Dimensions.get("window")
export default class VideoControlModal extends React.Component {

    _currentPosition = 0
    _offsetRate = 0
    _vodProgress = null
    _durations = null
    _swiper = null

    onLayout(e) {
        const { width, height } = Dimensions.get("window")
        if (width > height) {
            const {item} = this.props.navigation.state.params
            if (item) {
                let videoId = item.contentId ? item.contentId : '5714823997001'
                this.props.navigation.navigate('BrightcovePlayerScreen', {
                    videoId: videoId
                })
            }
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            showBrightcove: false,
            recordEnabled: false,
            favoriteEnabled: false,
            firstTimePlay: false,
            isPlaying: true,
            modalVisibility: false,
            modalRecordTarget: "none",
            modalFavoriteTarget: "none",
            passTime: 0,
            etrTime: 0,
            volume: 0,
            index: -1,
            isScrollEnabled: true
        }

        this.alertModal = null
    }

    componentWillMount() {
        Orientation.unlockAllOrientations()
        Orientation.unlockAllOrientations()
        this._panResponder = PanResponder.create({
            onPanResponderGrant: this._onPanResponderGrant,
            onMoveShouldSetPanResponder: this._onStartShouldSetPanResponder,
            onMoveShouldSetPanResponderCapture: this._onStartShouldSetPanResponder,
            onPanResponderMove: this._onPanResponderMove,
            onPanResponderRelease: this._onPanResponderRelease,
        })
    }

    componentWillUnmount() {
        clearInterval(this._getTimeInterval)
        clearInterval(this._getVodTime)
    }

    componentWillReceiveProps(nextProps) {
        let bcVideos = nextProps.bcVideos;
        if (!bcVideos.isFetching && !this.state.firstTimePlay) {
            let json = {
                url: bcVideos.data.sources.filter(x => { return !!x.container})[0].src,
                playPosition: 0
            }
            NativeModules.STBManager.playMediaStartWithJson(JSON.stringify(json), (error, events) => {
            })

            let progressJson = {
                url: bcVideos.data.sources.filter(x => { return !!x.container})[0].src,
                destination_path: '/C/Downloads'
            }

            console.log('Progress json %s', JSON.stringify(progressJson))
            NativeModules.STBManager.mediaDownloadGetProgressWithJson(JSON.stringify(progressJson), (e, r) => {
                console.log(r[0])
            })
        }
    }

    componentDidMount() {
        const {item, isLive, epg} = this.props.navigation.state.params

        NativeModules.STBManager.isConnect((connectStr) => {
            let json = JSON.parse(connectStr).is_connected
            this.setState({isConnected: json})
        })


        NativeModules.STBManager.getVolumeInJson((error, events) => {
            this.setState({volume: parseInt(JSON.parse(events[0]).volume)})
        })

        this.setState({
            currentTime: new Date().getTime(),
            startPoint: new Date().getTime()
        })

        if (isLive) {
            // Change channel with lcn
            NativeModules.STBManager.setZapWithJsonString(JSON.stringify({lCN:item.channelData.lcn}),(error, events) => {
                console.log(JSON.parse(events[0]))
            })
            // Calculate offsetRate for dragging
            let durations = (new Date(item.endTime).getTime() - new Date(item.startTime).getTime()) / 1000
            this._offsetRate = width / durations
        }
        else {
            this.props.getBcVideos(item.contentId)
            // Calculate offsetRate for dragging
            this._offsetRate = width / item.durationInSeconds

        }

        Orientation.addOrientationListener(this._orientationDidChange);
    }

    _orientationDidChange = (orientation) => {
        if (orientation === 'LANDSCAPE' || (width > height)) {
            this.setState({showBrightcove: true})
        } else {
            this.setState({showBrightcove: false})
        }
    };


    _showAlertModal = () => {
        console.log(this.alertModal.state.isShow)
        if (!this.alertModal.state.isShow) {
            this.alertModal.setState({isShow: true, message: "Rotate your device to watch on the phone!"})
        }
    }

    getCurrentPosition() {
        return this._currentPosition
    }

    setPosition(pos) {
        if (pos > width) {
            return;
        }
        let periodRate = Math.round(pos / this._offsetRate)
        let currentPos = periodRate < 0 ? 0 : periodRate
        // Display played area
        console.log('Dragging to position %s', periodRate, currentPos, this._durations)
        this.setState({
            currentPos: currentPos
        })
        this._vodProgress.setNativeProps({
            style: [styles.vodProgressStyle, {
                width: (currentPos / this._durations) * 100 + "%"
            }]
        })
    }

    setCurrentPosition(newPos) {
        let pos = this._currentPosition + newPos
        if (pos < 0)
            pos = 0
        if (pos > width)
            return;
        this._currentPosition += newPos
        if (this.state.isConnected) {
            let json = {
                playPosition: Math.round(this._currentPosition / this._offsetRate)
            }
            NativeModules.STBManager.playMediaSetPositionWithJson(JSON.stringify(json), (e,r) => {})
        }
    }

    _onStartShouldSetPanResponder = (event, gestureState) => {
        console.log("DY", gestureState.dy, "DX", gestureState.dx);
        return (gestureState.dx != 0 || gestureState.dy != 0);
    };

    _onPanResponderMove = (event, gestureState) => {
        this.setState({dragging: true})
        this._onChangeScrollEnabled(false);
        this.setPosition(this.getCurrentPosition() + gestureState.dx);
    };

    _onPanResponderRelease = (event, gestureState) => {
        this.setState({dragging: false});
        this._onChangeScrollEnabled(true);
        this.setCurrentPosition(gestureState.dx);
        return true;
    }

    _onPanResponderGrant = (event, gestureState) => {
        this._onChangeScrollEnabled(false);
    }

    _getVodProgressStyle = () => {
        const {item, epg, isLive} = this.props.navigation.state.params
        const {index, currentPos} = this.state
        let progress = isLive === true ? this._getLiveProgress(epg[index] === undefined ? item.startTime : epg[index].startTime, epg[index] === undefined ? item.endTime : epg[index].endTime)
            : (currentPos / this._durations) * 100

        if (isLive !== true && progress >= 100 && index !== epg.length - 1) {
            this._swiper.scrollBy(1)
        }

        return [styles.vodProgressStyle, {
            width: progress + "%"
        }]
    }

    _getVodTime = setInterval(() => {
        const {isLive} = this.props.navigation.state.params;
        if (!isLive) {
            NativeModules.STBManager.playMediaGetPositionInJson((e, r) => {
                let pos = JSON.parse(r[0]).playPosition
                if (this.state.dragging === undefined || this.state.dragging === false) {
                    this.setState({
                        currentPos: pos === 'error' ? this._durations : pos
                    })
                }
            })
        }
    }, 1000);

    _getTimeInterval = setInterval(() => {
        const {isLive} = this.props.navigation.state.params;
        const {isConnected} = this.state
        if (isLive || !isConnected) {
            if (this.state.isPlaying) {
                this.setState({
                    currentTime: new Date().getTime()
                })
            }
        }
    }, 1000)

    _getLivePassedTime = (isLive, timeInSeconds) => {
        if (isLive) {
            let time = this.state.currentTime
            let startTime = new Date(timeInSeconds)
            let passed = (time - startTime.getTime()) / 1000
            if (passed > 0) return secondFormatter(passed.toString())
        }
        else {
            return secondFormatter(this.state.currentPos ? this.state.currentPos : 0)
        }
    }

    _getEtrTime = (isLive, timeInSeconds, durationInSeconds) => {
        if (isLive) {
            let time = this.state.currentTime
            let endTime = new Date(timeInSeconds)
            let passed = (endTime.getTime() - time) / 1000
            if (passed > 0) return "-" + secondFormatter(passed.toString())
        }
        else {
            const {currentPos} = this.state

            let etrTime = durationInSeconds - currentPos
            if (etrTime > 0) return "-" + secondFormatter(etrTime.toString())
        }
    }

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

    _getLiveProgress = (startTime, endTime) => {
        const {currentTime} = this.state;
        let durationInMsSecons = (new Date(endTime)).getTime() - (new Date(startTime)).getTime()
        let passedTime = currentTime - (new Date(startTime)).getTime();
        return (passedTime / durationInMsSecons) * 100
    }

    _renderPlaybackController = (item) => {
        const {recordEnabled, favoriteEnabled} = this.state
        const {bcVideos} = this.props
        const {isLive} = this.props.navigation.state.params;

        let playIconSrc;
        if (isLive) {
            playIconSrc = require('../../assets/ic_on_tv.png')
        }
        else {
            playIconSrc = this.state.isPlaying !== true ? require('../../assets/ic_play_with_border.png') : require('../../assets/ic_pause.png')
        }

        return (
            <View style={styles.playbackContainer}>
                <View style={{height: '11%',
                                    width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                                alignItems: 'center'}}>
                    <Text style={styles.passedText}>
                        {this._getLivePassedTime(isLive, item.startTime ? item.startTime : 0 , item.durationInSeconds ? item.durationInSeconds : 1)}
                    </Text>
                    <Text style={styles.etrText}>
                        {this._getEtrTime(isLive, item.endTime ? item.endTime : 0, item.durationInSeconds ? item.durationInSeconds : 1)}
                    </Text>
                </View>
                <View style={styles.topButtonsContainer}>
                    <TouchableOpacity disabled={!this.state.isConnected}
                                      style={[styles.buttonStyle, {
                                          backgroundColor: recordEnabled === true ? colors.mainPink : 'transparent' }]}
                                      onPress={this._onRecordPress}>
                        <Image source={require('../../assets/ic_record.png')}
                               style={styles.buttonIconStyle}/>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={!this.state.isConnected}
                                      style={[styles.buttonStyle, {
                                          backgroundColor: favoriteEnabled === true ? colors.mainPink : 'transparent' }]}
                                      onPress={this._onFavouritePress}>
                        <Image source={require('../../assets/ic_heart_with_border.png')}
                               style={styles.buttonIconStyle}/>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={!this.state.isConnected}
                                      style={styles.buttonStyle}
                                      onPress={() => this._shareExecution(item.title, "")}>
                        <Image source={require('../../assets/ic_share.png')}
                               style={styles.buttonIconStyle}/>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={!this.state.isConnected}
                                      style={styles.buttonStyle}
                                      onPress={() => this._resetPlayPosition()}>
                        <Image source={require('../../assets/ic_start_over.png')}
                               style={styles.buttonIconStyle}/>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={!this.state.isConnected}
                                      style={styles.buttonStyle}>
                        <Image source={require('../../assets/ic_caption.png')}
                               style={styles.buttonIconStyle}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.mediaInfoContainer}>
                    <Text style={styles.titleText}
                            >
                        {isLive !== true ? item.title : item.videoData.title}
                    </Text>
                    <Text style={styles.typeText}>
                        {this._formatGenresText(isLive !== true ? item.genresData : item.videoData.genresData)}
                    </Text>
                </View>
                <View style={[styles.playbackButtons]}>
                    <TouchableOpacity disabled={!this.state.isConnected}
                                      onPress={() => this._backWard()}
                                      style={[styles.rewindButton, {
                                          opacity: isLive === true ? 0.17 : 1}]}>
                        <Image source={require('../../assets/ic_rewind.png')}
                               style={{resizeMode: 'contain',
                                            width: '100%',
                                            height: '100%'}}/>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={!this.state.isConnected}
                                      style={{ width: '21%',
                                                height: '100%'}}
                                      onPress={() => this._playMediaControl(bcVideos) }>
                        <Image source={playIconSrc}
                               style={styles.buttonIconStyle}/>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={!this.state.isConnected}
                                      onPress={() => this._fastForward()}
                                      style={[styles.fastForwardButton, {
                                          opacity: isLive === true ? 0.17 : 1}]}>
                        <Image source={require('../../assets/ic_fastforward.png')}
                               style={styles.buttonIconStyle}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.volumeSeekBarContainer}>
                    <TouchableOpacity style={styles.volumeLessIcon}>
                        <Image source={require('../../assets/ic_quieter.png')}
                               style={styles.buttonIconStyle}/>
                    </TouchableOpacity>
                    <VolumeSeeker width={260}
                                  thumbSize={16}
                                  maxValue={100}
                                  onVolumeChange={this._onVolumeChange}
                                  onChangedScrollEnabled={this._onChangeScrollEnabled}
                                  disabled={!this.state.isConnected}/>
                    <TouchableOpacity style={styles.volumeMoreIcon}>
                        <Image source={require('../../assets/ic_louder.png')}
                               style={styles.buttonIconStyle}/>
                    </TouchableOpacity>
                </View>
            </View>)
    }

    _renderRecordBar = (isLive, startTime, endTime) => {
        const {currentTime} = this.state
        if (isLive) {
            let marginLeft = this._getRecordStartMargin(startTime, endTime) <= 0 ? '3%' : this._getRecordStartMargin(startTime, endTime) + "%"
            let width = this._getRecordProgress(currentTime, startTime, endTime)
            return (
                <View style={[styles.recordBar, {
                    left: marginLeft,
                    width: width}]}/>
            )
        }
        else return null
    }

    _renderTopContainer = (item, isLive) => {
        let data = item
        if (item.serviceID) {
            if (!epg.data) {
                return null
            }
            data = epg.data[0].videoData
        }

        let iconUrl = ''
        if (isLive === false) {
            if (data.originalImages && data.originalImages.length > 0) {
                iconUrl = data.originalImages[0].url
            }
        }
        else {
            if (data.videoData.originalImages && data.videoData.originalImages.length > 0) {
                iconUrl = data.videoData.originalImages[0].url
            }
        }

        return (
            <View style={styles.topContainer}
                  {...this._panResponder.panHandlers}>
                <ImageBackground style={styles.topVideoControl}
                                 resizeMode="cover"
                                 source={{uri: iconUrl}}/>
                {this._renderRecordBar(isLive, item.startTime, item.endTime)}
                <Animated.View ref={(ref) => this._vodProgress = ref}
                               style={this._getVodProgressStyle()}>
                </Animated.View>
                <TouchableOpacity style={{position: 'absolute',
                                            bottom: 20,
                                            right: 20}}
                                  onPress={this._showAlertModal}>
                    <Image source={require('../../assets/ic_change_orientation.png')}/>
                </TouchableOpacity>
            </View>
        )
    }

    _renderUpperPage = (epg, item) => {
        let data = item
        const {isLive} = this.props.navigation.state.params

        if (item.serviceID) {
            if (!epg.data) {
                return null
            }
            data = epg.data[0].videoData
        }

        let iconUrl = ''
        if (isLive === false) {
            if (data.originalImages && data.originalImages.length > 0) {
                iconUrl = data.originalImages[0].url
            }
        }
        else {
            if (data.videoData.originalImages && data.videoData.originalImages.length > 0) {
                iconUrl = data.videoData.originalImages[0].url
            }
        }

        return (
            <View style={{width: '100%',
                        height: height}}
                  key={item}>

                <View style={styles.bottomContainer}>
                    <ImageBackground style={styles.bottomVideoControl}
                                     resizeMode="cover"
                                     blurRadius={10}
                                     source={{uri: iconUrl}}/>
                    {this._renderPlaybackController(data)}
                    <TouchableOpacity style={{position: 'absolute',
                                                bottom: 25,
                                                right: 25}}
                                      onPress={() => this._informationPress(item, epg, isLive)}>
                        <Image source={require('../../assets/ic_information.png')}
                               style={styles.infoImage}/>
                    </TouchableOpacity>
                </View>
                {this._renderTopContainer(item, isLive)}
            </View>)
    }

    _renderModal = () => {
        const {item, epg} = this.props.navigation.state.params;

        this._durations = item.durationInSeconds
        let index = epg.findIndex(x => x.title ? x.title === item.title && x.durationInSeconds === item.durationInSeconds : x.channelData.lcn === item.channelData.lcn)
        return (
            <View
                onLayout={this.onLayout.bind(this)}
                style={{flex: 1}}>
                <Swiper scrollEnabled={this.state.isScrollEnabled}
                        loop={false} loadMinimal={true}
                        loadMinimalSize={1}
                        onIndexChanged={this._onSwiperIndexChanged}
                        showsPagination={false}
                        horizontal={true}
                        style={styles.pageViewStyle}
                        removeClippedSubviews={false}
                        index={index}
                        ref={(ref) => this._swiper = ref}>
                    { epg.map(value => this._renderUpperPage(epg, value)) }
                </Swiper>
                <TouchableOpacity style={{position: 'absolute',
                                                top: 10 + rootViewTopPadding(),
                                                left: 30,
                                                width: 50,
                                                height: 50}}
                                  onPress={() => this.props.navigation.goBack()}>
                    <Image source={require('../../assets/ic_dismiss_modal.png')}/>
                </TouchableOpacity>
            </View>

        );

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
                <Modal animationType={'fade'}
                       transparent={true}
                       visible={this.state.modalVisibility}
                       onRequestClose={() => console.log('close')}>
                    <View style={styles.modal}>
                        <BlurView blurRadius={getBlurRadius(30)}
                                  style={styles.modalBlurView}
                                  overlayColor={1}/>
                        <TouchableOpacity style={styles.close}
                                          onPress={() => this._toggleModal()}>
                            <Image source={require('../../assets/ic_modal_close.png')} />
                        </TouchableOpacity>
                        <View style={styles.modalInsideContainer}>
                            <Image source={{uri: iconUrl}}
                                   style={styles.modalImage}/>
                            <Text style={styles.modalTitleText}>{item.title}</Text>
                            <Text style={styles.modalShortDes}>{"Series - Episode " + item.seasonIndex}</Text>
                            <Text style={styles.modalLongDes}>{item.longDescription}</Text>
                            <View style={{flexDirection: 'row',
                                marginBottom: '11%',
                                marginTop: 'auto'}}>
                                <TouchableOpacity style={{ flexDirection: 'row',
                                    alignItems: 'center'}}
                                                  onPress={() => this._onModalButtonPress(this.state.modalContent, 'item')}>
                                    <View style={{width: 40,
                                        height: 40,
                                        marginRight: 7,
                                        backgroundColor: firstButtonImg,
                                        borderRadius: 20}}>
                                        <Image source={img}
                                               style={styles.buttonIconStyle}/>
                                    </View>
                                    <Text>{"Episode " + item.seasonIndex}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{flexDirection: 'row',
                                    alignItems: 'center',
                                    marginLeft: 11}}
                                                  onPress={() => this._onModalButtonPress(this.state.modalContent, 'series')}>
                                    <View style={{width: 40,
                                        height: 40,
                                        marginRight: 7,
                                        backgroundColor: secondButtonImg,
                                        borderRadius: 20}}>
                                        <Image source={img}
                                               style={styles.buttonIconStyle}/>
                                    </View>
                                    <Text>{seriesInfo.data ? seriesInfo.data.title : ""}</Text>
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
        return(
            <View style={styles.container}>
                <AlertModal ref={(modal)=>{this.alertModal = modal}}/>
                {this._renderRecordModal()}
                {this._renderModal()}
            </View>
        )
    }

    _onSwiperIndexChanged = (index) => {
        const {item, isLive, epg} = this.props.navigation.state.params
        if (!isLive) {
            this.props.getBcVideos(epg[index].contentId)
            this._durations = epg[index] === undefined ? 0 : epg[index].durationInSeconds
            this.setState({
                index: index,
                isPlaying: true,
                currentPos: 0
            })
        }
    }

    _onChangeScrollEnabled = (isEnabled) => {
        this.setState({isScrollEnabled: isEnabled})
    };

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
                    if (recordEnabled) {
                        // Stop downloading current item
                        this.stopDownload()
                    }
                    else {
                        // Start or resume downloading current item
                        this._downloadExecution()
                    }
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
                }

                this.setState({
                    recordEnabled: !recordEnabled
                })
            }
            else {
                // Use Userkit

                this.setState({
                    favoriteEnabled: !favoriteEnabled
                })
            }
        }
    }

    _shareExecution = (title, url) => {
        content = {
            message: "",
            title: title,
            url: url
        }
        Share.share(content, {})
    }

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

    _informationPress = (item, epg, isLive) => {
        this.props.navigation.replace('DetailsPage', {
            item: item,
            epg: epg.data,
            isLive: isLive
        })
    }

    _bookExecution = (liveItem) => {
        let durationInSeconds = Math.round((new Date(liveItem.endTime).getTime() - new Date(liveItem.startTime).getTime()) / 1000)


        let jsonString = {
            "record_parameter": {
                "startTime" : this._simpleDataFormat(liveItem.startTime),
                "recordMode" : 1,
                "recordName" : liveItem.videoData.title,
                "lCN" : liveItem.channelData.lcn,
                "duration" : durationInSeconds

            },
            "metaData": {
                "endtime": liveItem.endTime,
                "starttime": liveItem.startTime,
                "title": liveItem.videoData.title,
                "image": liveItem.videoData.originalImages[0].url,
                "subTitle": liveItem.videoData.genresData.length > 0 ? liveItem.videoData.genresData[0].name : ""
            }
        }

        console.log('JSON String for record')
        console.log(JSON.stringify(jsonString))

        NativeModules.STBManager.recordPvrStartWithJsonString(JSON.stringify(jsonString), (error, events) => {
            console.log('Record start')
            console.log(events)
        })
    }

    _downloadExecution = () => {
        const {epg, item} = this.props.navigation.state.params
        const {bcVideos} = this.props
        const { index } = this.state

        let videoData = index === -1 ? item : epg[index]

        let json = {
            contentId: bcVideos.data.contentId,
            url: bcVideos.data.sources.filter(x => { return !!x.container})[0].src,
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

                    NativeModules.RNUserKit.storeProperty("download_list", { dataArr: params }, (e, r) => {
                    })
                })
            }
            else console.log(result)
        })
    }

    stopDownload = () => {
        const {bcVideos} = this.props

        let json = {
            remove_flag: 1,
            contentId: bcVideos.data.contentId,
            url: bcVideos.data.sources.filter(x => { return !!x.container})[0].src,
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

    _stopRecord = () => {
        NativeModules.STBManager.recordPvrStopInJson((error, events) => {
            console.log(events[0])
        })
    }

    _backWard = () => {
        NativeModules.STBManager.playMediaGetPositionInJson((error, events) => {
            if (!error) {
                let playPos = (JSON.parse(events[0]).playPosition - 10) < 0 ? 0 : (JSON.parse(events[0]).playPosition - 10)
                let playPosInJson = "{\n" +
                    "\tplayPosition: \n" + playPos + "}"
                NativeModules.STBManager.playMediaSetPositionWithJson(playPosInJson, (error, events) => {

                })
            }
        })
    }

    _fastForward = () => {
        NativeModules.STBManager.playMediaGetPositionInJson((error, events) => {
            if (!error) {
                let playPos = (JSON.parse(events[0]).playPosition + 10) < 0 ? 0 : (JSON.parse(events[0]).playPosition + 10)
                let playPosInJson = "{\n" +
                    "\tplayPosition: \n" + playPos + "}"
                NativeModules.STBManager.playMediaSetPositionWithJson(playPosInJson, (error, events) => {

                })
            }
        })
    }

    _playMediaControl = (bcVideos) => {
        if (bcVideos.data) {

            this.setState({isPlaying: !this.state.isPlaying})
            if (this.state.isPlaying) {
                NativeModules.STBManager.playMediaPause((error, events) => {

                })
            }
            else {
                NativeModules.STBManager.playMediaResume((error, events) => {
                })
            }
        }
    }

    _resetPlayPosition = () => {
        let json = {
            playPosition: 0
        }
        NativeModules.STBManager.playMediaSetPositionWithJson(JSON.stringify(json), (error, events) => {

        })
    }

    _onRecordPress = () => this._toggleModal('record')

    _onFavouritePress = () => this._toggleModal('favorite')

    _onVolumeChange = (newValue) => {
        let jsonString = {
            volume: newValue
        }
        // Check connection before set volume
        NativeModules.STBManager.isConnect((events) => {
            if (this.state.isConnected) NativeModules.STBManager.setVolumeWithJsonString(JSON.stringify(jsonString), (error, events) => {})
        })
    }

    _formatGenresText = (genresData) => {
        let returnText = ''
        genresData.forEach(genres => {
            returnText += genres.name + " "
        })
        return returnText
    }

    _keyExtractor = (item, index) => index;

    _simpleDataFormat = (time) => {
        return moment(time).format("YYYY-MM-DD hh:mm:ss")
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
    overflow:'hidden',
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
    right:0,
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
    right:0,
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


