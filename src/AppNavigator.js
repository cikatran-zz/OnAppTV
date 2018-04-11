import React, {Component} from 'react';
import {ScreenStack} from './registerScreens';
import {
    addNavigationHelpers,
} from 'react-navigation';
import {connect} from "react-redux";
import {
    createReduxBoundAddListener,
    createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';

function mapStateToProps (state) {
  return {
    nav: state.nav,
  }
}

const addListener = createReduxBoundAddListener("root");

class AppNavigator extends Component {
  render() {
    return (
        <ScreenStack navigation={addNavigationHelpers({
            dispatch: this.props.dispatch,
            state: this.props.nav,
            addListener,
        })} />
    )
  };
}

export default connect(mapStateToProps)(AppNavigator);