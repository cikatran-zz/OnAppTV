import React from 'react'
import {View,Text, Image, ImageBackground, StyleSheet, StatusBar, Dimensions, TouchableOpacity} from 'react-native'
import BlurView from '../../components/BlurView'
import {colors} from '../../utils/themeConfig'
import Orientation from 'react-native-orientation';
import BrightcovePlayer from "../../components/BrightcovePlayer";
import CircleButton from "../../components/CircleButton"
import VolumeSeeker from "../../components/VolumeSeeker"
import LowerPagerComponent from "../../components/LowerPageComponent"
import Swiper from '@nart/react-native-swiper';


export default class VideoControlModal extends React.PureComponent {
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
    }
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange);
    this.props.getEpgs("putChannelIdHere")
  }

  _orientationDidChange = (orientation) => {
    console.log(orientation);
    if (orientation === 'LANDSCAPE' || (width > height)) {
      this.setState({showBrightcove: true})
    } else {
      this.setState({showBrightcove: false})
    }
  };

  _renderPlaybackController = () => {
    return (<View style={styles.playbackContainer}>
      <View style={styles.topButtonsContainer}>
        <CircleButton size={44} image={'record'} style={{marginRight: 12}} />
        <CircleButton size={44} image={'favorite'} style={{marginRight: 12}}/>
        <CircleButton size={44} image={'share'} style={{marginRight: 12}} imageStyle={{marginBottom: 4}}/>
        <CircleButton size={44} image={'rewind'} style={{marginRight: 12}}/>
        <CircleButton size={44} image={'subtitle'} style={{marginRight: 12}}/>
      </View>
      <View style={styles.mediaInfoContainer}>
        <Text style={styles.titleText}>At Frida Kahlo's</Text>
        <Text style={styles.typeText}>Documentary</Text>
      </View>
      <View style={styles.playbackButtons}>
        <TouchableOpacity style={styles.rewindButton}>
          <Image source={require('../../assets/ic_rewind.png')}/>
        </TouchableOpacity>
        <CircleButton size={70} image={'play'} imageStyle={{marginLeft: 5}}/>
        <TouchableOpacity style={styles.fastForwardButton}>
          <Image source={require('../../assets/ic_fastforward.png')}/>
        </TouchableOpacity>
      </View>
      <View style={styles.volumeSeekBarContainer}>
        <TouchableOpacity style={styles.volumeLessIcon}>
          <Image source={require('../../assets/ic_quieter.png')}/>
        </TouchableOpacity>
        <VolumeSeeker width={270} thumbSize={16} maxValue={100}/>
        <TouchableOpacity style={styles.volumeMoreIcon}>
          <Image source={require('../../assets/ic_louder.png')}/>
        </TouchableOpacity>
      </View>
    </View>)
  }

  _renderLowerPage = () => {
    const {epg} = this.props
    if (!epg.data) {
      return (<LowerPagerComponent/>)
    }
    let listData = epg.data.epgsData
    // PUT HERE CURRENT PLAYING VIDEO
    // CURRENTLY SET THIS TO FIRST VIDEO OF CHANNEL
    // CHANGE LOGIC HERE FOR ANOTHER VIDEO LIKE STANDALONE
    let video = listData[0]

    return(
      <LowerPagerComponent videoType="channel" listData={epg.data} video={video}/>
    )
  }

  _renderModal = () => {
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
          style={{width: '100%', height: '100%'}}>
          <Swiper horizontal={false} loop={false} showsPagination={false}>
            <View style={{width: '100%', height: '100%'}}>
              <View style={styles.topContainer}>
                <ImageBackground style={styles.topVideoControl}
                                 resizeMode="cover"
                                 source={{uri: 'http://hitwallpaper.com/wp-content/uploads/2013/06/Cartoons-Disney-Company-Simba-The-Lion-King-3d-Fresh-New-Hd-Wallpaper-.jpg'}}/>
              </View>
              <View style={styles.bottomContainer}>
                <ImageBackground style={styles.bottomVideoControl}
                                 resizeMode="cover"
                                 blurRadius={10}
                                 source={{uri: 'http://hitwallpaper.com/wp-content/uploads/2013/06/Cartoons-Disney-Company-Simba-The-Lion-King-3d-Fresh-New-Hd-Wallpaper-.jpg'}} />
                <View style={styles.blurOverlay}/>
                {this._renderPlaybackController()}
              </View>
            </View>
            {this._renderLowerPage()}
          </Swiper>
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

const {width, height} = Dimensions.get("window");

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
    flex: 1,
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
    top: 43,
    width: 272,
    height: 260,
    left: 51,
  },
  topButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  mediaInfoContainer: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    marginTop: 27
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 34
  },
  rewindButton: {
    width: 33,
    height: 21,
    opacity: 0.17,
    marginRight: 40
  },
  fastForwardButton: {
    marginLeft: 40,
    width: 33,
    height: 21,
    opacity: 0.17
  },
  volumeSeekBarContainer: {
    flex: 1,
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