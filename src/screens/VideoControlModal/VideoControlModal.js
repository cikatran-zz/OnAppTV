import React from 'react'
import {
  View, Text, Image, ImageBackground, StyleSheet, StatusBar, Dimensions, TouchableOpacity, SectionList, Animated,
  Modal
} from 'react-native'
import {colors} from '../../utils/themeConfig'
import Orientation from 'react-native-orientation';
import BrightcovePlayer from "../../components/BrightcovePlayer";
import CircleButton from "../../components/CircleButton"
import VolumeSeeker from "../../components/VolumeSeeker"
import LowerPagerComponent from "../../components/LowerPageComponent"
import VerticalSwiper from '../../components/VerticalSwiper';
import BlurView from '../../components/BlurView'
import { getBlurRadius } from '../../utils/blurRadius'


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
      modalVisibility: false
    }
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

    return (<View style={styles.playbackContainer}>
      <View style={styles.topButtonsContainer}>
        <TouchableOpacity style={[styles.buttonStyle, {backgroundColor: recordEnabled === true ? colors.mainPink : 'transparent' }]} onPress={this._onRecordPress}>
          <Image source={require('../../assets/ic_record.png')} style={{alignSelf: 'center', width: '100%', height: '100%'}}/>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonStyle, {backgroundColor: favoriteEnabled === true ? colors.mainPink : 'transparent' }]} onPress={this._onFavouritePress}>
          <Image source={require('../../assets/ic_heart_with_border.png')} style={{alignSelf: 'center'}}/>
        </TouchableOpacity>
        <TouchableOpacity style={{width: 46, height: 46, marginRight: 12}}>
          <Image source={require('../../assets/ic_share.png')} style={{alignSelf: 'center'}}/>
        </TouchableOpacity>
        <TouchableOpacity style={{width: 46, height: 46, marginRight: 12}}>
          <Image source={require('../../assets/ic_repeat.png')} style={{alignSelf: 'center'}}/>
        </TouchableOpacity>
        <TouchableOpacity style={{width: 46, height: 46, marginRight: 12}}>
          <Image source={require('../../assets/ic_caption.png')} style={{alignSelf: 'center'}}/>
        </TouchableOpacity>
      </View>
      <View style={styles.mediaInfoContainer}>
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.typeText}>{this._formatGenresText(item.genresData)}</Text>
      </View>
      <View style={styles.playbackButtons}>
        <TouchableOpacity style={styles.rewindButton}>
          <Image source={require('../../assets/ic_rewind.png')}/>
        </TouchableOpacity>
        <TouchableOpacity style={{ width: 75, height: 75}}>
          <Image source={require('../../assets/ic_play_with_border.png')} style={{alignSelf: 'center'}}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fastForwardButton}>
          <Image source={require('../../assets/ic_fastforward.png')}/>
        </TouchableOpacity>
      </View>
      <View style={styles.volumeSeekBarContainer}>
        <TouchableOpacity style={styles.volumeLessIcon}>
          <Image source={require('../../assets/ic_quieter.png')}/>
        </TouchableOpacity>
        <VolumeSeeker width={260} thumbSize={16} maxValue={100}/>
        <TouchableOpacity style={styles.volumeMoreIcon}>
          <Image source={require('../../assets/ic_louder.png')}/>
        </TouchableOpacity>
      </View>
    </View>)
  }

  _renderLowerPage = (epg, item) => {

    if (!epg.data) {
      return (<LowerPagerComponent/>)
    }
    let listData = epg.data
    console.log('listData')
    console.log(listData)
    // use this variable when navigating from channel list
    let video = listData[0]

    return(
      <LowerPagerComponent toggleModal={this._toggleModal} videoType={item.serviceID ? 'channel' : item.type} listData={listData} video={item.serviceID ? video : item}/>
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
    console.log('upperpage 166')
    console.log(data)

    return (
      <View style={{width: '100%', height: height}}>
        <View style={styles.topContainer}>
          <ImageBackground style={styles.topVideoControl}
                           resizeMode="cover"
                           source={{uri: data.originalImages[0].url}}/>
        </View>
        <View style={styles.bottomContainer}>
          <ImageBackground style={styles.bottomVideoControl}
                           resizeMode="cover"
                           blurRadius={10}
                           source={{uri: data.originalImages[0].url}}/>
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
  _renderModal = () => {
    const {item} = this.props.navigation.state.params;
    const {epg} = this.props

    if (this.state.showBrightcove) {
      return (
        <BrightcovePlayer
          onLayout={this.onLayout.bind(this)}
          style={{width: '100%', height: '100%', left: 0, top: 0}}
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
    height: '40%',
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
    marginTop: 11
  },
  bottomContainer: {
    height: '60%',
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
    height: '150%'
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
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    paddingTop: 43,
  },
  topButtonsContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  mediaInfoContainer: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  titleText: {
    color: colors.whitePrimary,
    fontSize: 17
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
    marginTop: 28
  },
  rewindButton: {
    width: 33,
    height: 21,
    marginRight: 40
  },
  fastForwardButton: {
    marginLeft: 40,
    width: 33,
    height: 21,
  },
  volumeSeekBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 34,
  },
  volumeLessIcon: {
    marginRight: 2,
    width: 7,
    height: 10
  },
  volumeMoreIcon: {
    marginLeft: 2,
    width: 17,
    height: 15
  },
  dragContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonStyle: {
    width: 46,
    height: 46,
    marginRight: 12,
    borderRadius: 23
  }
})

const fakeBannerInfoData = {
  title: 'At Frida Kahlo’s',
  type: 'Drama',
  specificInfo: 'The Blue House” located in Mexico City, is the home where Frida Kahlo was born (1907) and would die (1954). She is surrounded not only by painter Diego Rivera, but also by Leon Trotsky, André Breton, Sergei Eisenstein, Pablo Neruda, Waldo Frank, Pablo Picasso, Marcel Duchamp, Vassily Kandinsky, etc'
}

const fakeListData = [
  {key: 'Nicolas',type: 'Drama',start_time: '21h30',end_time: '22h30', url: 'https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'},
  {key: 'Gorrilas in Danger',type: 'Documentary',start_time: '21h30',end_time: '22h30', url: 'https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'},
  {key: 'I\'m Roger Casement',type: 'Art-Dance',start_time: '21h30',end_time: '22h30', url: 'https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'},
  {key: 'Aaron',type: 'Concert',start_time: '21h30',end_time: '22h30', url: 'https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'},
  {key: 'The Mythes - Orphee',type: 'Documentary',start_time: '21h30',end_time: '22h30', url: 'https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'},
  {key: 'Art of Movie',type: 'Documentary',start_time: '22h30',end_time: '23h15',url: 'https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'}]