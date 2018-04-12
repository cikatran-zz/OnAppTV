/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StatusBar, StyleSheet} from 'react-native';
import STBConnectionView from '../../components/STBConnectionView'
import Orientation from 'react-native-orientation';

export default class STBConnection extends Component {



    constructor(props) {
        super(props);
    };

    componentWillMount() {
        Orientation.lockToPortrait();
    }

    _onFinished = (event) => {
      const { navigate } = this.props.navigation;
        navigate('Home', {})
    }

    componentDidMount() {
        StatusBar.setBarStyle('light-content');
        (Platform.OS != 'ios') && StatusBar.setBackgroundColor('#000000');
    }

    render() {
        return (
            <STBConnectionView style={{width: '100%', height: '100%', left: 0, top: 0}} onFinished={this._onFinished} />
        );
    }
}

const styles = StyleSheet.create({
});
