/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {Image, NativeModules, Platform, StatusBar, StyleSheet, View} from 'react-native';
import STBConnectionView from '../../components/STBConnectionView'
import Orientation from 'react-native-orientation';
import {NavigationActions} from "react-navigation";
import ControlModal from "../../components/ControlModal";
import {colors} from "../../utils/themeConfig";

export default class STBConnection extends Component {


    constructor(props) {
        super(props);
        this.isLoggedIn = false;
    };

    componentWillMount() {
        Orientation.lockToPortrait();
    }

    _onFinished = (event) => {
        let screen = "Authentication";
        if (this.isLoggedIn) {
            screen = "Home";
        }
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: screen
                })
            ]
        });
        this.props.navigation.dispatch(resetAction);
    };

    componentDidMount() {
        StatusBar.setBarStyle('light-content');
        (Platform.OS != 'ios') && StatusBar.setBackgroundColor('#000000');
        NativeModules.RNUserKitIdentity.checkSignIn((error, results) => {
            let result = JSON.parse(results[0]);
            if (result.is_sign_in) {
                this.isLoggedIn = true;
            } else {
                this.isLoggedIn = false;
            }
            this._onFinished(null);
        });
    }

    render() {
        const onAppIc = require('../../assets/ic_on_stb.png')
        return (<View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.mainPink
        }}>
            <Image source={onAppIc}/>
        </View>);
    }
}

const styles = StyleSheet.create({});
