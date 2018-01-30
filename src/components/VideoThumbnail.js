import React from 'react'
import {
  StyleSheet, ImageBackground, View
} from 'react-native'
import {colors} from '../utils/themeConfig'

class VideoThumbnail extends React.PureComponent{
  constructor(props){
    super(props);
  }

  _renderRedlineProgress = () => {
    const {showProgress} = this.props;
    if (showProgress) {
      return (<View style={[styles.redLine, this._runProgressRedline()]}/>)
    }
  }

  _runProgressView = () => {
    const {progress} = this.props;
    return {
      width: progress
    }
  }

  _runProgressRedline = () => {
    const {progress} = this.props;
    return {
      left: progress
    }
  }
  render(){
    return (
      <View style={styles.container}>
        <ImageBackground imageStyle={{ borderRadius: 3 }} style={styles.imageContainer} source={{uri: this.props.imageUrl}}>
          <View style={[styles.progressView, this._runProgressView()]}/>
        </ImageBackground>
          {this._renderRedlineProgress()}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    width: '40%',
    margin: 5,
  },
  imageContainer: {
    flexDirection: 'row',
    width: '100%',
    aspectRatio: 2,
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressView: {
    backgroundColor: colors.progressColor,
    height: '100%',
    width: '0%'
  },
  redLine: {
    position: 'absolute',
    backgroundColor: colors.mainPink,
    height: 30,
    width: 1,
    left: '0%',
    bottom: -20
  }
});

export default VideoThumbnail;