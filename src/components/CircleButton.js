import React from 'react'
import {Button, Text, View, Image, StyleSheet, TouchableOpacity} from 'react-native'

class CircleButton extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  _renderImage = (isPlay, image, height, width) => {
    return !isPlay ? (<Image style={styles.mainImage} source={icons[image]}/>)
      : (<Image source={icons[image]} style={[ styles.mainImage, {position: 'absolute', top: height * 0.3, left: width * 0.38,  width: width * 0.33, height: height * 0.33}]}/>)
  }

  render() {
    const {size, image} = this.props
      return(
        <TouchableOpacity style={[styles.circleContainer, {height: size, width: size, borderRadius: size * 0.5}, this.props.style]}>
          {this._renderImage(image === 'play', image, size, size)}
        </TouchableOpacity>
      )
  }
}

const styles = StyleSheet.create({
  circleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ffffff'
  },
  mainImage: {
    alignSelf: 'center',
    resizeMode: 'stretch',
    backgroundColor: 'transparent'
  }
});
const icons = {
  play: require('../assets/ic_play.png'),
  pause: require('../assets/ic_pause.png'),
  record: require('../assets/ic_record.png'),
  favorite: require('../assets/ic_favorite.png'),
  share: require('../assets/ic_share.png'),
  rewind: require('../assets/ic_repeat.png'),
  subtitle: require('../assets/ic_subtitle.png')
}

export default CircleButton;