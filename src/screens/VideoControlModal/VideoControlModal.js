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
import LowerPagerComponent from "../../components/LowerPageComponent"
import VerticalSwiper from '../../components/VerticalSwiper';
import BlurView from '../../components/BlurView'
import {getBlurRadius} from '../../utils/blurRadius'


const { width, height } = Dimensions.get("window")
export default class VideoControlModal extends React.Component {
  onLayout(e) {
    const { width, height } = Dimensions.get("window")
    if (width > height) {
      this.setState({showBrightcove: true})
    } else {
      this.setState({showBrightcove: false})
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      showBrightcove: false,
      recordEnabled: false,
      favoriteEnabled: false,
      isPlaying: true,
      modalVisibility: false,
      modalRecordTarget: "none",
      modalFavoriteTarget: "none"
    }
  }

  componentWillMount() {
    Orientation.unlockAllOrientations()
  }

  componentDidMount() {
    const {item} = this.props.navigation.state.params

    switch (item.type) {
      case 'Standalone': {
        // Find video with related genre
        this.props.getEpgWithGenre(item.genreIds)
        break;
      }
      case 'Episode': {
        this.props.getEpgWithSeriesId([item.seriesId])
        this.props.getSeriesInfo([item.seriesId])
        break;
      }
      default: {
        this.props.getEpgs([item.serviceID])
      }
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

  _renderPlaybackController = (item) => {
    const {recordEnabled, favoriteEnabled} = this.state

    return (
      <View style={styles.playbackContainer}>
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
          <TouchableOpacity style={styles.buttonStyle}>
            <Image source={require('../../assets/ic_start_over.png')} style={styles.buttonIconStyle}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyle}>
            <Image source={require('../../assets/ic_caption.png')} style={styles.buttonIconStyle}/>
          </TouchableOpacity>
        </View>
        <View style={styles.mediaInfoContainer}>
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.typeText}>{this._formatGenresText(item.genresData)}</Text>
        </View>
        <View style={styles.playbackButtons}>
          <TouchableOpacity style={styles.rewindButton}>
            <Image source={require('../../assets/ic_rewind.png')} style={{resizeMode: 'contain', width: '100%', height: '100%'}}/>
          </TouchableOpacity>
          <TouchableOpacity style={{ width: '21%', height: '100%'}} onPress={() => this.setState({isPlaying: !this.state.isPlaying})}>
            <Image source={this.state.isPlaying !== true ? require('../../assets/ic_play_with_border.png') : require('../../assets/ic_pause.png')} style={styles.buttonIconStyle}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.fastForwardButton}>
            <Image source={require('../../assets/ic_fastforward.png')} style={styles.buttonIconStyle}/>
          </TouchableOpacity>
        </View>
        <View style={styles.volumeSeekBarContainer}>
          <TouchableOpacity style={styles.volumeLessIcon}>
            <Image source={require('../../assets/ic_quieter.png')} style={styles.buttonIconStyle}/>
          </TouchableOpacity>
          <VolumeSeeker width={260} thumbSize={16} maxValue={100}/>
          <TouchableOpacity style={styles.volumeMoreIcon}>
            <Image source={require('../../assets/ic_louder.png')} style={styles.buttonIconStyle}/>
          </TouchableOpacity>
        </View>
    </View>)
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
      <LowerPagerComponent toggleModal={this._toggleModal}
                           videoType={item.serviceID ? 'channel' : item.type}
                           listScrollOffsetY={this._onLowerPageScroll}
                           listData={listData} video={item.serviceID ? video : item}/>
    )
  }

  _renderUpperPage = (epg, item) => {
    let data = item

    if (item.serviceID) {
      if (!epg.data) {
        return null
      }
      data = epg.data[0].videoData
    }

    return (
      <View style={{width: '100%', height: height}}>

        <View style={styles.bottomContainer}>
          <ImageBackground style={styles.bottomVideoControl}
                           resizeMode="cover"
                           blurRadius={10}
                           source={{uri: data.originalImages[0].url}}/>
          {this._renderPlaybackController(data)}
        </View>
        <View style={styles.topContainer}>
          <ImageBackground style={styles.topVideoControl}
                           resizeMode="cover"
                           source={{uri: data.originalImages[0].url}}/>
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
  _renderModal = () => {
    const {item} = this.props.navigation.state.params;
    const {epg} = this.props

    if (this.state.showBrightcove) {
      return (
        <BrightcovePlayer
          onLayout={this.onLayout.bind(this)}
          style={{width: '100%', height: '100%', left: 0, top: 0, backgroundColor: "#000000"}}
          videoId='5714823997001'
          accountId='5706818955001'
          policyKey='BCpkADawqM13qhq60TadJ6iG3UAnCE3D-7KfpctIrUWje06x4IHVkl30mo-3P8b7m6TXxBYmvhIdZIAeNlo_h_IfoI17b5_5EhchRk4xPe7N7fEVEkyV4e8u-zBtqnkRHkwBBiD3pHf0ua4I'/>);
    } else {

      return (
        <View
          onLayout={this.onLayout.bind(this)}
          style={{flex: 1}}>
          <VerticalSwiper
            style={styles.dragContainer}
            content={this._renderLowerPage(epg, item)}>
            {this._renderUpperPage(epg, item)}
          </VerticalSwiper>
        </View>

      );
    }
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
          if (recordEnabled) {
            // Stop downloading current item
          }
          else {
            // Start or resume downloading current item
          }
        }
        else {
          if (recordEnabled) {
            // Stop recording current channel
          }
          else {
            // Start recording
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

    })
  }

  stopDownload = () => {
    let dataPath = "/Download"
    let url = ""
    let json = {
      removeFlag: 1, // 0 -> not delele media, 1 -> delete
      destination_path: dataPath,
      url: url
    }
    NativeModules.STBManager.mediaDownloadStopWithJson(JSON.stringify(json), (error, events) => {

    })
  }

  _downloadExecution = (vodItem) => {
    let url = ""
    let dataPath = "/Download"
    let jsonString = {
      destination_path: dataPath,
      url: url
    }

    NativeModules.STBManager.mediaDownloadStartWithJson(JSON.stringify(jsonString), (error, events) => {
      if (error) {
        console.log(error)
      }
      else {
        console.log(events)
        // If download start successfully -> add to Userkit with 2 props : contentId and destination path => in order to display at bookmark page

      }
    })
  }

  _bookExecution = (liveItem) => {
      let durationInSeconds = Math.round((new Date(liveItem.endTime).getTime() - new Date(liveItem.startTime).getTime()) / 1000)

      let metaData = {
        "endtime": liveItem.endTime,
        "starttime": liveItem.startTime,
        "title": liveItem.videoData.title,
        "image": liveItem.videoData.originalImages[0].url,
        "subTitle": liveItem.genresData.length > 0 ? liveItem.genresData[0] : ""
      }

      let jsonString = {
        "record": {
          "startTime" : liveItem.startTime,
          "recordMode" : 1,
          "recordName" : liveItem.videoData.title,
          "lCN" : liveItem.videoData.lcn,
          "duration" : durationInSeconds

        },
        "metaData": JSON.stringify(metaData)
      }

      NativeModules.STBManager.addPvrBooKListWithJson(JSON.stringify(jsonString), (error, events) => {
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
    top: 6,
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
    paddingTop: '11%',
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
  }
})
