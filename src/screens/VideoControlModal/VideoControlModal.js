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
import { secondFormatter } from '../../utils/timeUtils'


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
      passTime: 0,
      etrTime: 0,
      volume: 0
    }
  }

  componentWillMount() {
    Orientation.unlockAllOrientations()
  }

  _getTimeInterval = setInterval(() => {
      this.setState({
        currentTime: new Date().getTime()
      })
    }, 1000)

  componentWillUnmount() {
    clearInterval(this._getTimeInterval)

    NativeModules.STBManager.playMediaStop((error, events) => {})

  }

  componentDidMount() {
    const {item, isLive} = this.props.navigation.state.params

    NativeModules.STBManager.getVolumeInJson((error, events) => {
        if (!error) {
            this.setState({volume: JSON.parse(events[0]).volume})
        }
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

      this.setState({
        currentTime: new Date().getTime(),
        startPoint: new Date().getTime()
      })
    }
    else {
      //Test play video
      NativeModules.STBManager.playMediaStartWithJson(jsonString, (error, events) => {
      })
    }

    switch (item.type) {
      case 'Standalone': {
        // Find video with related genre
        this.props.getEpgWithGenre(item.genreIds)
        break;
      }
      case 'Episode': {
        this.props.getEpgWithSeriesId([item.seriesId])
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

  _onVolumeChange = (newValue) => {
    this.setState({ volume: newValue })
    let jsonString = "{\n" +
      "\tvolume: \n" + newValue + "}"
    NativeModules.STBManager.setVolumeWithJsonString(jsonString, (error, events) => {})
  }

  _getLivePassedTime = (isLive, timeInSeconds, durationInSeconds) => {
      if (isLive) {
        let time = this.state.currentTime
        let startTime = new Date(timeInSeconds)
        let passed = (time - startTime.getTime()) / 1000
        if (passed > 0) return secondFormatter(passed.toString())
      }
      else {

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
      return ''
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
    if (recordedTime <= 0) return '1%'
    else return recordedTime + "%"
  }

  _getLiveProgress = (startTime, endTime) => {
    const {currentTime} = this.state;
    let durationInSeconds = (new Date(endTime)).getTime() - (new Date(startTime)).getTime()
    let passedTime = currentTime - (new Date(startTime)).getTime();
    return (passedTime / durationInSeconds) * 100 + "%"
  }

  _renderPlaybackController = (item) => {
    const {recordEnabled, favoriteEnabled} = this.state
    const {isLive} = this.props.navigation.state.params;

    return (
      <View style={styles.playbackContainer}>
        <View style={{height: '11%', width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={styles.passedText}>{this._getLivePassedTime(isLive, item.startTime ? item.startTime : 0 )}</Text>
          <Text style={styles.etrText}>{this._getEtrTime(isLive, item.endTime ? item.endTime : 0)}</Text>
        </View>
        <View style={styles.topButtonsContainer}>
          <TouchableOpacity style={[styles.buttonStyle, {backgroundColor: recordEnabled === true ? colors.mainPink : 'transparent' }]} onPress={this._onRecordPress}>
            <Image source={require('../../assets/ic_record.png')} style={styles.buttonIconStyle}/>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.buttonStyle, {backgroundColor: favoriteEnabled === true ? colors.mainPink : 'transparent' }]} onPress={this._onFavouritePress}>
            <Image source={require('../../assets/ic_heart_with_border.png')} style={styles.buttonIconStyle}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyle}>
            <Image source={require('../../assets/ic_share.png')} style={styles.buttonIconStyle}/>
          </TouchableOpacity>
          <TouchableOpacity disabled={isLive}  style={styles.buttonStyle}>
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
        <View style={styles.playbackButtons}>
          <TouchableOpacity  onPress={() => {
              NativeModules.STBManager.playMediaGetPositionInJson((error, events) => {
                if (!error) {
                  let playPos = (JSON.parse(events[0]).playPosition - 10) < 0 ? 0 : (JSON.parse(events[0]).playPosition - 10)
                  let playPosInJson = "{\n" +
                    "\tplayPosition: \n" + playPos + "}"
                  NativeModules.STBManager.playMediaSetPositionWithJson(playPosInJson, (error, events) => {})
                }
              })
            }
          } style={styles.rewindButton}>
            <Image source={require('../../assets/ic_rewind.png')} style={{resizeMode: 'contain', width: '100%', height: '100%'}}/>
          </TouchableOpacity>
          <TouchableOpacity  disabled={isLive}  style={{ width: '21%', height: '100%'}} onPress={() => {
            this.setState({isPlaying: !this.state.isPlaying})
            if (this.state.isPlaying) {
              NativeModules.STBManager.playMediaPause((error, events) => {})
            }
            else {
              NativeModules.STBManager.playMediaResume((error, events) => {})
            }
          }
          }>
            <Image source={this.state.isPlaying !== true ? require('../../assets/ic_play_with_border.png') : require('../../assets/ic_pause.png')} style={styles.buttonIconStyle}/>
          </TouchableOpacity>
          <TouchableOpacity  disabled={isLive} onPress={() => {
            NativeModules.STBManager.playMediaGetPositionInJson((error, events) => {
              if (!error) {
                let playPos = (JSON.parse(events[0]).playPosition + 10) < 0 ? 0 : (JSON.parse(events[0]).playPosition + 10)
                let playPosInJson = "{\n" +
                  "\tplayPosition: \n" + playPos + "}"
                console.log(playPosInJson)
                NativeModules.STBManager.playMediaSetPositionWithJson(playPosInJson, (error, events) => {})
              }
            })
          }} style={styles.fastForwardButton}>
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
    console.log(this._getRecordProgress(currentTime, startTime, endTime))
    if (isLive) {
      let marginLeft = this._getRecordStartMargin(startTime, endTime) <= 0 ? '3%' : this._getRecordStartMargin(startTime, endTime) + "%"

      return (
        <View style={[styles.recordBar, {marginLeft: marginLeft, width: this._getRecordProgress(currentTime, startTime, endTime)}]}/>
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
      <LowerPagerComponent toggleModal={this._toggleModal}
                           videoType={item.serviceID ? 'channel' : item.type}
                           listScrollOffsetY={this._onLowerPageScroll}
                           listData={listData} video={item.serviceID ? video : item}/>
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
      <View style={{width: '100%', height: height}}>

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
          <View style={{width: isLive === true ? this._getLiveProgress(item.startTime, item.endTime) : '69%', height: '100%', backgroundColor: 'rgba(17,17,19,0.45)', position: 'absolute', top: 0, left: 0}}>

          </View>
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
          {this._renderUpperPage(epg, item)}

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
        this.setState({
          recordEnabled: !recordEnabled
        })
      }
      else {
        this.setState({
          favoriteEnabled: !favoriteEnabled
        })
      }
    }
  }

  _onModalButtonPress = (actionType) => {
    const {recordEnabled, favoriteEnabled} = this.state

    if (actionType === 'record') {
      this.setState({
        recordEnabled: !recordEnabled
      })
    }
    else {
      this.setState({
        favoriteEnabled: !favoriteEnabled
      })
    }
  }

  _renderRecordModal = () => {
    let img = this.state.modalContent === 'record' ? require('../../assets/ic_record_black_border.png') : require('../../assets/ic_heart_black_border.png')

    return (
      <Modal animationType={'fade'} transparent={true}
              visible={this.state.modalVisibility} onRequestClose={() => console.log('close')}>
        <View style={styles.modal}>
          <BlurView blurRadius={getBlurRadius(30)} style={styles.modalBlurView} overlayColor={1}/>
          <TouchableOpacity style={styles.close} onPress={() => this._toggleModal()}>
            <Image source={require('../../assets/ic_modal_close.png')} />
          </TouchableOpacity>
          <View style={styles.modalInsideContainer}>
            <Image source={{uri: 'http://hs.sbcounty.gov/CN/Photo%20Gallery/Sample%20Picture%20-%20Koala.jpg?Mobile=1&Source=%2FCN%2F_layouts%2Fmobile%2Fdispform%2Easpx%3FList%3D1720b750%252D8275%252D4398%252Da0b8%252D6c84221f704f%26View%3Dffcf12f7%252D5df8%252D4de0%252Da991%252D79340a805821%26ID%3D1%26CurrentPage%3D1'}} style={styles.modalImage}/>
            <Text style={styles.modalTitleText}>Ma pire angoise</Text>
            <Text style={styles.modalShortDes}>Short des</Text>
            <Text style={styles.modalLongDes}>Long des</Text>
            <View style={{flexDirection: 'row', marginBottom: '11%', marginTop: 'auto'}} >
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center'}} onPress={() => this._onModalButtonPress(this.state.modalContent)}>
                <Image source={img} style={{width: 40, height: 40, marginRight: 7}}/>
                <Text>Sample 1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center' ,marginLeft: 11}} onPress={() => this._onModalButtonPress(this.state.modalContent)}>
                <Image source={img} style={{width: 40, height: 40, marginRight: 7}}/>
                <Text>Sample 2</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
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
    marginTop: 11
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
    left: 0,
    backgroundColor: colors.mainPink
  }
})

const jsonString = "{\n" +
  "      \"url\": \"http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4\",\n" +
  "      \"playPosition\": 0\n" +
  "    }"


