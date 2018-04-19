/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet, View, StatusBar,
    NativeModules, Platform
} from 'react-native';
import Orientation from 'react-native-orientation';
import {rootViewTopPadding} from '../../utils/rootViewTopPadding'
import Swiper from 'react-native-swiper';
import {colors} from "../../utils/themeConfig";
import ZapperChannel from './ZapperChannel'
import ZapperContent from './ZapperContent'


export default class Zappers extends Component {

    constructor(props) {
        super(props);
    };

    componentWillMount() {
        Orientation.lockToPortrait();
    };

    componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('light-content');
            (Platform.OS !== 'ios') && StatusBar.setBackgroundColor('transparent');
        });
    };

    componentWillUnmount() {
        this._navListener.remove();
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor='#00000000'
                    barStyle='light-content'/>
                <Swiper loop={false} horizontal={true} showsPagination={true} style={styles.pageViewStyle} removeClippedSubviews={false}>
                    <ZapperChannel />
                    <ZapperContent />
                </Swiper>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    pageViewStyle: {
        backgroundColor: colors.screenBackground
    }
});
