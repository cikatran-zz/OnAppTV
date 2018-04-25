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
    View
} from 'react-native'
import {colors} from '../../utils/themeConfig'
import Orientation from 'react-native-orientation';
import BrightcovePlayer from "../../components/BrightcovePlayer";
import VolumeSeeker from "../../components/VolumeSeeker"
import LowerPagerComponent from "../../screens/LowerPage/LowerPageComponent"
import BlurView from '../../components/BlurView'
import {getBlurRadius} from '../../utils/blurRadius'
import {secondFormatter} from '../../utils/timeUtils'
import Swiper from 'react-native-swiper'
import PinkRoundedButton from '../../components/PinkRoundedLabel'
import { rootViewTopPadding } from '../../utils/rootViewPadding'
import moment from 'moment';

const {width, height} = Dimensions.get("window")
export default class VideoControlModal extends React.Component {

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

  _releaseOrientationCallback = () => {
    Orientation.unlockAllOrientations()
  }

  _navigateBrightcovePlayerScreen = () => {
    const {item} = this.props.navigation.state.params
    if (item) {
      let videoId = item.contentId ? item.contentId : '5714823997001'
      this.props.navigation.navigate('BrightcovePlayerScreen', {
        videoId: videoId,
        callback: this._releaseOrientationCallback
      })
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
    }

    componentWillMount() {
        Orientation.unlockAllOrientations()
    }

    _getVodTime = setInterval(() => {
        const {isLive} = this.props.navigation.state.params;
        if (!isLive) {

            NativeModules.STBManager.playMediaGetPositionInJson((e, r) => {
                if (!e) {
                    let pos = JSON.parse(r[0]).playPosition
                    this.setState({
                        currentPos: pos
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

    componentWillUnmount() {
        clearInterval(this._getTimeInterval)
        clearInterval(this._getVodTime)

        NativeModules.STBManager.playMediaStop((error, events) => {
        })

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
        if (e) console.log(e)
        else console.log(r[0])
      })
    }
  }

    componentDidMount() {
        const {item, isLive, epg} = this.props.navigation.state.params
        console.log(epg)

    NativeModules.STBManager.isConnect((connectStr) => {
      let json = JSON.parse(connectStr).is_connected
      if (json === true) this.setState({isConnected: true})
    })


    NativeModules.STBManager.getVolumeInJson((error, events) => {
        if (!error) {
            this.setState({volume: parseInt(JSON.parse(events[0]).volume)})
        }
    })

    this.setState({
      currentTime: new Date().getTime(),
      startPoint: new Date().getTime()
    })

    if (isLive) {
      // Change channel with lcn
      NativeModules.STBManager.setZapWithJsonString(JSON.stringify({lCN:item.channelData.lcn}),(error, events) => {
        if (error) {
          console.log(error);
        } else {
          console.log(JSON.parse(events[0]))
        }
      })
    }
    else {
      //Test play video
      this.props.getBcVideos(item.contentId)
    }

    Orientation.addOrientationListener(this._orientationDidChange);
    // PUT YOUR CHANNEL ID HERE
  }

  _orientationDidChange = (orientation) => {
    if (orientation === 'LANDSCAPE' || (width > height)) {
      this.setState({showBrightcove: true})
    } else {
      this.setState({showBrightcove: false})
    }
  };

  _formatGenresText = (genresData) => {
    let returnText = ''
    genresData.forEach(genres => {
      returnText += genres.name + " "
    })
    return returnText
  }

  _onRecordPress = () => {

    this._toggleModal('record')
  }

  _onFavouritePress = () => {

    this._toggleModal('favorite')

  }

  _onVolumeChange = (newValue) => {
    this.setState({ volume: newValue })
    let jsonString = {
      volume: newValue
    }
    // Check connection before set volume
    NativeModules.STBManager.isConnect((events) => {
      if (this.state.isConnected) NativeModules.STBManager.setVolumeWithJsonString(JSON.stringify(jsonString), (error, events) => {})
    })
  }

  _getLivePassedTime = (isLive, timeInSeconds, durationInSeconds) => {
      if (isLive) {
        let time = this.state.currentTime
        let startTime = new Date(timeInSeconds)
        let passed = (time - startTime.getTime()) / 1000
        if (passed > 0) return secondFormatter(passed.toString())
      }
      else {
        const {startPoint, currentTime} = this.state

        let passedTime = (currentTime - startPoint) / 1000
        if (passedTime > 0) return secondFormatter(passedTime.toString())
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
      const {startPoint, currentTime} = this.state

      let etrTime = durationInSeconds - ((currentTime - startPoint) / 1000)
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
    return (passedTime / durationInMsSecons) * 100 + "%"
  }

  _getVodProgress = (durationInSeconds) => {
    const {startPoint, currentTime} = this.state

    let passedTime = (currentTime - startPoint) / 1000
    return (passedTime / durationInSeconds) * 100 + "%"
  }

  _renderPlaybackController = (item) => {
    const {recordEnabled, favoriteEnabled} = this.state
    const {bcVideos} = this.props
    const {isLive} = this.props.navigation.state.params;

    return (
      <View style={styles.playbackContainer}>
        <View style={{height: '11%', width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={styles.passedText}>{this._getLivePassedTime(isLive, item.startTime ? item.startTime : 0 , item.durationInSeconds ? item.durationInSeconds : 1)}</Text>
          <Text style={styles.etrText}>{this._getEtrTime(isLive, item.endTime ? item.endTime : 0, item.durationInSeconds ? item.durationInSeconds : 1)}</Text>
        </View>
        <View style={styles.topButtonsContainer}>
          <TouchableOpacity style={[styles.buttonStyle, {backgroundColor: recordEnabled === true ? colors.mainPink : 'transparent' }]} onPress={this._onRecordPress}>
            <Image source={require('../../assets/ic_record.png')} style={styles.buttonIconStyle}/>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.buttonStyle, {backgroundColor: favoriteEnabled === true ? colors.mainPink : 'transparent' }]} onPress={this._onFavouritePress}>
            <Image source={require('../../assets/ic_heart_with_border.png')} style={styles.buttonIconStyle}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => this._shareExecution(item.title, "")}>
            <Image source={require('../../assets/ic_share.png')} style={styles.buttonIconStyle}/>
          </TouchableOpacity>
          <TouchableOpacity disabled={isLive}  style={styles.buttonStyle} onPress={() => {
            let json = {
              playPosition: 0
            }
            NativeModules.STBManager.playMediaSetPositionWithJson(JSON.stringify(json), (error, events) => {

            })
          }}>
            <Image source={require('../../assets/ic_start_over.png')} style={styles.buttonIconStyle}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyle}>
            <Image source={require('../../assets/ic_caption.png')} style={styles.buttonIconStyle}/>
          </TouchableOpacity>
        </View>
        <View style={styles.mediaInfoContainer}>
          <Text style={styles.titleText}>{isLive !== true ? item.title : item.videoData.title}</Text>
          <Text style={styles.typeText}>{this._formatGenresText(isLive !== true ? item.genresData : item.videoData.genresData)}</Text>
        </View>
        <View style={[styles.playbackButtons, {opacity: isLive === true ? 0.17 : 1}]}>
          <TouchableOpacity  onPress={() => {
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
          } style={styles.rewindButton}>
            <Image source={require('../../assets/ic_rewind.png')} style={{resizeMode: 'contain', width: '100%', height: '100%'}}/>
          </TouchableOpacity>
          <TouchableOpacity style={{ width: '21%', height: '100%', opacity: isLive === true ? 0.17 : 1}} onPress={() => {
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
          }>
            <Image source={this.state.isPlaying !== true ? require('../../assets/ic_play_with_border.png') : require('../../assets/ic_pause.png')} style={styles.buttonIconStyle}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            NativeModules.STBManager.playMediaGetPositionInJson((error, events) => {
              if (!error) {
                let playPos = (JSON.parse(events[0]).playPosition + 10) < 0 ? 0 : (JSON.parse(events[0]).playPosition + 10)
                let playPosInJson = "{\n" +
                  "\tplayPosition: \n" + playPos + "}"
                NativeModules.STBManager.playMediaSetPositionWithJson(playPosInJson, (error, events) => {

                })
              }
            })
          }} style={[styles.fastForwardButton, {opacity: isLive === true ? 0.17 : 1}]}>
            <Image source={require('../../assets/ic_fastforward.png')} style={styles.buttonIconStyle}/>
          </TouchableOpacity>
        </View>
        <View style={styles.volumeSeekBarContainer}>
          <TouchableOpacity style={styles.volumeLessIcon}>
            <Image source={require('../../assets/ic_quieter.png')} style={styles.buttonIconStyle}/>
          </TouchableOpacity>
          <VolumeSeeker width={260} thumbSize={16} maxValue={100} value={this.state.volume} onVolumeChange={this._onVolumeChange}/>
          <TouchableOpacity style={styles.volumeMoreIcon}>
            <Image source={require('../../assets/ic_louder.png')} style={styles.buttonIconStyle}/>
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
        <View style={[styles.recordBar, {left: marginLeft, width: width}]}/>
      )
    }
    else return null
  }

  _onLowerPageScroll = (y) => {
    console.log("ScrollY", y)
  }

  _renderLowerPage = (epg, item) => {

    if (!epg.data) {
      return (<LowerPagerComponent listScrollOffsetY={this._onLowerPageScroll}/>)
    }
    let listData = epg.data
    console.log('listData')
    console.log(listData)
    // use this variable when navigating from channel list
    let video = listData[0]

    return(
      <LowerPagerComponent
        toggleModal={this._toggleModal}
        videoType={item.serviceID ? 'channel' : item.type}
        listScrollOffsetY={this._onLowerPageScroll}
        listData={listData} video={item.serviceID ? video : item}/>
    )
  }

  _renderTopContainer = (epg, index, isLive) => {
    let item = this.state.index === -1 ? epg[index] : epg[this.state.index]
    let data = item
    if (item.serviceID) {
      if (!epg.data) {
        return null
      }
      data = epg.data[0].videoData
    }
    return (
      <View style={styles.topContainer}>
        <ImageBackground style={styles.topVideoControl}
                         resizeMode="cover"
                         source={isLive !== true ? {uri: data.originalImages[0].url} : {uri: data.videoData.originalImages[0].url}}/>
        {this._renderRecordBar(isLive, item.startTime, item.endTime)}
        <View style={{width: isLive === true ? this._getLiveProgress(item.startTime, item.endTime) : this._getVodProgress(item.durationInSeconds), height: '100%', backgroundColor: 'rgba(17,17,19,0.45)', position: 'absolute', top: 0, left: 0}}>

        </View>
        <TouchableOpacity style={{position: 'absolute', bottom: 25, right: 25}} onPress={this._navigateBrightcovePlayerScreen}>
          <Image source={require('../../assets/ic_change_orientation.png')}/>
        </TouchableOpacity>
      </View>
    )
  }

  _renderLive = (epg, item) => {
    let data = item
    const {isLive} = this.props.navigation.state.params

    if (item.serviceID) {
      if (!epg.data) {
        return null
      }
      data = epg.data[0].videoData
    }

    return (
      <View style={{width: '100%', height: height}} key={item}>

        <View style={styles.bottomContainer}>
          <ImageBackground style={styles.bottomVideoControl}
                           resizeMode="cover"
                           blurRadius={10}
                           source={ isLive !== true ? {uri: data.originalImages[0].url} : {uri: data.videoData.originalImages[0].url}}/>
          {this._renderPlaybackController(data)}
        </View>

        <View style={styles.topContainer}>
          <ImageBackground style={styles.topVideoControl}
                           resizeMode="cover"
                           source={isLive !== true ? {uri: data.originalImages[0].url} : {uri: data.videoData.originalImages[0].url}}/>
          {this._renderRecordBar(isLive, item.startTime, item.endTime)}
          <View style={{width: isLive === true ? this._getLiveProgress(item.startTime, item.endTime) : this._getVodProgress(item.durationInSeconds), height: '100%', backgroundColor: 'rgba(17,17,19,0.45)', position: 'absolute', top: 0, left: 0}}>
          </View>
          <TouchableOpacity style={{position: 'absolute', top: 30, left: 20, width: 50, height: 50}} onPress={() => this.props.navigation.goBack()}>
            <Image source={require('../../assets/ic_dismiss_modal.png')}/>
          </TouchableOpacity>
          <TouchableOpacity style={{position: 'absolute', bottom: 25, right: 25}} onPress={this._navigateBrightcovePlayerScreen}>
            <Image source={require('../../assets/ic_change_orientation.png')}/>
          </TouchableOpacity>
        </View>
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

    return (
      <View style={{width: '100%', height: height}} key={item}>

        <View style={styles.bottomContainer}>
          <ImageBackground style={styles.bottomVideoControl}
                           resizeMode="cover"
                           blurRadius={10}
                           source={ isLive !== true ? {uri: data.originalImages[0].url} : {uri: data.videoData.originalImages[0].url}}/>
          {this._renderPlaybackController(data)}
        </View>

      </View>)
  }

  _keyExtractor = (item, index) => index;

  _handleViewableChanged = (viewableItems) => {
    console.log("on Scroll");
    // this.videoScroll.scrollToLocation({sectionIndex: 1, itemIndex: 1, viewPosition: 0});
    Animated.event([
      { nativeEvent: { contentOffset: { y: this.scrollY } } },
      { useNativeDriver: true },
    ])
  }

  _onSwiperIndexChanged = (index) => {
    const {item, isLive, epg} = this.props.navigation.state.params
    if (!isLive) {
      this.props.getBcVideos(epg[index].contentId)
      this.setState({
        index: index,
        isPlaying: true
      })
    }
  }

  _renderModal = () => {
    const {item, epg, isLive} = this.props.navigation.state.params;

      // Right now, Live is just one video, check for one video
      if (isLive) {
        return (
          <View
            onLayout={this.onLayout.bind(this)}
            style={{flex: 1}}>
            {this._renderLive({}, item)}
          </View>
        )
      }

      let index = epg.findIndex(x => x.title ? x.title === item.title && x.durationInSeconds === item.durationInSeconds : x.channelData.lcn === item.channelData.lcn)

      return (
        <View
          onLayout={this.onLayout.bind(this)}
          style={{flex: 1}}>
          <Swiper loop={false} loadMinimal={true} loadMinimalSize={1} onIndexChanged={this._onSwiperIndexChanged} showsPagination={false} horizontal={true} style={styles.pageViewStyle} removeClippedSubviews={false} index={index}>
            {
              epg.map(value => this._renderUpperPage(epg, value))
            }
          </Swiper>
          {this._renderTopContainer(epg, index, isLive)}
          <TouchableOpacity style={{position: 'absolute', top: 30, left: 30, width: 50, height: 50}} onPress={() => this.props.navigation.goBack()}>
            <Image source={require('../../assets/ic_dismiss_modal.png')}/>
          </TouchableOpacity>
        </View>

      );

  }

  _toggleModal = (actionType) => {
    const {item, isLive} = this.props.navigation.state.params
    console.log(actionType + " " + item.type)

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
          console.log(recordEnabled)
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
          console.log(recordEnabled)
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

  _stopRecord = () => {
    NativeModules.STBManager.recordPvrStopInJson((error, events) => {
      console.log(events[0])
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

  _simpleDataFormat = (time) => {
    console.log('Time')
    console.log(moment(time).format("YYYY-MM-DD hh:mm:ss"))
    return moment(time).format("YYYY-MM-DD hh:mm:ss")
  }

  _bookExecution = (liveItem) => {
    console.log('Live item')
    console.log(liveItem)
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
        if (error)
          console.log(error)
        else console.log(events)
      })
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
        recordEnabled: modalRecordTarget === secondActionType ? false : true,
        modalRecordTarget: modalRecordTarget === secondActionType ? "none" : secondActionType
      })
    }
    else {
      // Use Userkit

      this.setState({
        favoriteEnabled: modalFavoriteTarget === secondActionType ? false : true,
        modalFavoriteTarget: modalFavoriteTarget === secondActionType ? "none" : secondActionType
      })
    }
  }

  _renderRecordModal = () => {
    const {modalContent, modalRecordTarget, modalFavoriteTarget} = this.state

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

    if (item.type === 'Episode') {
      return (
        <Modal animationType={'fade'} transparent={true}
                visible={this.state.modalVisibility} onRequestClose={() => console.log('close')}>
          <View style={styles.modal}>
            <BlurView blurRadius={getBlurRadius(30)} style={styles.modalBlurView} overlayColor={1}/>
            <TouchableOpacity style={styles.close} onPress={() => this._toggleModal()}>
              <Image source={require('../../assets/ic_modal_close.png')} />
            </TouchableOpacity>
            <View style={styles.modalInsideContainer}>
              <Image source={{uri: item.originalImages[0].url}} style={styles.modalImage}/>
              <Text style={styles.modalTitleText}>{item.title}</Text>
              <Text style={styles.modalShortDes}>{"Series - Episode " + item.seasonIndex}</Text>
              <Text style={styles.modalLongDes}>{item.longDescription}</Text>
              <View style={{flexDirection: 'row', marginBottom: '11%', marginTop: 'auto'}} >
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center'}} onPress={() => this._onModalButtonPress(this.state.modalContent, 'item')}>
                  <View style={{width: 40, height: 40, marginRight: 7, backgroundColor: firstButtonImg, borderRadius: 20}}>
                    <Image source={img} style={styles.buttonIconStyle}/>
                  </View>
                  <Text>{"Episode " + item.seasonIndex}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center' ,marginLeft: 11}} onPress={() => this._onModalButtonPress(this.state.modalContent, 'series')}>
                  <View style={{width: 40, height: 40, marginRight: 7, backgroundColor: secondButtonImg, borderRadius: 20}}>
                  <Image source={img} style={styles.buttonIconStyle}/>
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
        {this._renderRecordModal()}
        {this._renderModal()}

      </View>
    )
  }
}

const styles = StyleSheet.create({
  pageViewStyle: {
    paddingTop: rootViewTopPadding(),
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
    fontSize: 16
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
  }
})

const jsonString = "{\n" +
  "      \"url\": \"http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4\",\n" +
  "      \"playPosition\": 0\n" +
  "    }"


