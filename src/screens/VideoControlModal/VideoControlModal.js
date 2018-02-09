import React from 'react'
import {View, Image, ImageBackground, StyleSheet, StatusBar, Dimensions} from 'react-native'
import BlurView from '../../components/BlurView'
import {colors} from '../../utils/themeConfig'

export default class VideoControlModal extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  render() {
    return(
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor='#00000000'
          barStyle='light-content' />
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