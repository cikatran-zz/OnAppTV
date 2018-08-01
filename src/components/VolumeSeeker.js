import React from 'react'
import {StyleSheet} from 'react-native'
import Slider from "react-native-slider";
import {colors} from '../utils/themeConfig'

class VolumeSeeker extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        console.log("VALUE", this.props.value);
        return (
            <Slider
                disabled={this.props.disabled}
                style={{width: this.props.width}}
                value={this.props.value}
                maximumValue={100}
                thumbTintColor={colors.whitePrimary}
                thumbTouchSize={{width: this.props.thumbSize, height: this.props.thumbSize}}
                onValueChange={this.props.onVolumeChange}
                thumbStyle={{width: 16, height: 16}}
                trackStyle={styles.track}
                onSlidingStart={()=> this.props.onChangedScrollEnabled(false)}
                onSlidingComplete={()=>this.props.onChangedScrollEnabled(true)}
                minimumTrackTintColor={colors.mainPink}
                hitSlop={{top: 100, bottom: 30, left: 10, right: 0}}
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