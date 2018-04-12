import React from 'react'
import {StyleSheet} from 'react-native'
import Slider from "react-native-slider";
import { colors } from '../utils/themeConfig'

class VolumeSeeker extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      value: 10
    }
  }

  _onVolumeChange = (newValue) => {

  }

  render() {
    const {value} = this.state

    return(
      <Slider
        style={{width: this.props.width}}
        value={this.state.value}
        maximumValue={100}
        thumbTintColor={colors.whitePrimary}
        thumbTouchSize={{width: this.props.thumbSize, height: this.props.thumbSize}}
        onValueChange={value => this.setState({ value })}
        thumbStyle={{width: 16, height: 16}}
        trackStyle={styles.track}
        minimumTrackTintColor={colors.mainPink}
      />
    )
  }
}

const styles = StyleSheet.create({
  track: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)'
  }
})

export default VolumeSeeker