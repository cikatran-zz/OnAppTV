import React from 'react'
import {Button, Text, View, Image, StyleSheet, TouchableOpacity} from 'react-native'

class CircleButton extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const {size} = this.props
      return(
        <TouchableOpacity style={[styles.circleContainer, {height: size, width: size, borderRadius: size * 0.5}, this.props.style]}>
            <Image style={styles.mainImage} source={icons[this.props.image]}/>
        </TouchableOpacity>
      )
  }
}

const styles = StyleSheet.create({
  circleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff'
  },
  mainImage: {
    width: '50%',
    height: '50%',
    resizeMode: 'center',
    backgroundColor: 'transparent'
  }
});
const icons = {
  play: require('../assets/ic_play.png'),
  pause: require('../assets/ic_pause.png'),
  record: require('../assets/ic_record.png'),
  favorite: require('../assets/ic_favorite.png'),
  share: require('../assets/ic_share.png'),
  rewind: require('../assets/ic_rewind.png'),
  subtitle: require('../assets/ic_subtitle.png')
}

export default CircleButton;