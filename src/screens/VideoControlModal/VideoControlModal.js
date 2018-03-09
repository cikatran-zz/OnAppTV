import React from 'react'
import {View, Image, ImageBackground, StyleSheet, StatusBar, Dimensions} from 'react-native'
import BlurView from '../../components/BlurView'
import {colors} from '../../utils/themeConfig'
import Orientation from 'react-native-orientation';
import BrightcovePlayer from "../../components/BrightcovePlayer";

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
  }

  _orientationDidChange = (orientation) => {
      console.log(orientation);
      if (orientation === 'LANDSCAPE') {
          this.setState({showBrightcove: true})
      } else {
          this.setState({showBrightcove: false})
      }
  };
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
              style={{width: '100%', height: '100%', left: 0, top: 0}}>
                <View style={styles.topContainer}>
                    <ImageBackground style={styles.topVideoControl}
                                     resizeMode="cover"
                                     source={{uri: 'http://hitwallpaper.com/wp-content/uploads/2013/06/Cartoons-Disney-Company-Simba-The-Lion-King-3d-Fresh-New-Hd-Wallpaper-.jpg'}}/>
                </View>
                <View style={styles.bottomContainer}>
                    <ImageBackground style={styles.bottomVideoControl}
                                     resizeMode="stretch"
                                     source={{uri: 'http://hitwallpaper.com/wp-content/uploads/2013/06/Cartoons-Disney-Company-Simba-The-Lion-King-3d-Fresh-New-Hd-Wallpaper-.jpg'}} />
                    <View style={styles.blurOverlay}/>
                    <BlurView blurRadius={100} overlayColor={1} style={styles.blurView}/>
                </View>
            </View>);
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
  }

})