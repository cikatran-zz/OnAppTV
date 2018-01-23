import React, {Component} from 'react';
import {ScreenStack} from './registerScreens'
import {connect} from "react-redux";
const initialState = {};

function mapStateToProps (state) {
  return {
    nav: state.nav,
  }
}
class AppNavigator extends Component {
  render() {
    return (
      <ScreenStack />
    )
  };
}

export default connect(mapStateToProps)(AppNavigator);