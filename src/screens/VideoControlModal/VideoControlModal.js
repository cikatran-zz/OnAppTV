import React from 'react'
import {View,Text, Image, ImageBackground, StyleSheet, StatusBar, Dimensions, TouchableOpacity, SectionList, Animated} from 'react-native'
import {colors} from '../../utils/themeConfig'
import Orientation from 'react-native-orientation';
import BrightcovePlayer from "../../components/BrightcovePlayer";
import CircleButton from "../../components/CircleButton"
import VolumeSeeker from "../../components/VolumeSeeker"
import LowerPagerComponent from "../../components/LowerPageComponent"
import VerticalSwiper from '../../components/VerticalSwiper';


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
      favoriteEnabled: false
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
        this.props.getEpgs(this.props.channelId ? this.props.channelId : '5ac20aaa4ac42c344ab36d13')
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
    const {recordEnabled} = this.state

    this.setState({
      recordEnabled: !recordEnabled
    })
  }

  _onFavouritePress = () => {
    const {favoriteEnabled} = this.state

    this.setState({
      favoriteEnabled: !favoriteEnabled
    })
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
      return <LowerPagerComponent videoType={item.type} listData={epg.data} video={null}/>
    }
    let listData = epg.data
    // use this variable when navigating from channel list
    let video = listData[0]

    return(
      <LowerPagerComponent videoType={item.type} listData={listData} video={item}/>
    )
  }

  _renderUpperPage = (item) => {

    return (
      <View style={{width: '100%', height: height}}>
        <View style={styles.topContainer}>
          <ImageBackground style={styles.topVideoControl}
                           resizeMode="cover"
                           source={{uri: item.originalImages[0].url}}/>
        </View>
        <View style={styles.bottomContainer}>
          <ImageBackground style={styles.bottomVideoControl}
                           resizeMode="cover"
                           blurRadius={10}
                           source={{uri: item.originalImages[0].url}}/>
          {this._renderPlaybackController(item)}
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
          {this._renderLowerPage(epg, item)}
        </View>

      );
    }
  }

  render() {
    return(
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor='#00000000'
          barStyle='light-content' />
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