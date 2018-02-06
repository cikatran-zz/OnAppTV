import React, {Component} from 'react';
import {ScreenStack} from './registerScreens'
import {connect} from "react-redux";
import {View} from 'react-native'
import VideoControlModal from './components/VideoControlModal'
function mapStateToProps (state) {
  return {
    nav: state.nav,
  }
}
class AppNavigator extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <ScreenStack />
        <VideoControlModal />
      </View>
    )
  };
}

export default connect(mapStateToProps)(AppNavigator);