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
import {rootViewTopPadding} from '../../utils/rootViewPadding'
import Swiper from 'react-native-swiper';
import {colors} from "../../utils/themeConfig";
import ZapperChannel from './ZapperChannel'
import ZapperContent from './ZapperContent'


export default class Zappers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            scrollEnabled: true
        }
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

    _onChangeScrollEnabled = (isEnabled) => {
        this.setState({scrollEnabled: isEnabled})
    };

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor='#00000000'
                    barStyle='light-content'/>
                <Swiper loop={false} horizontal={true} showsPagination={true} style={styles.pageViewStyle} removeClippedSubviews={false} scrollEnabled={this.state.scrollEnabled}>
                    <ZapperChannel navigation={this.props.navigation} />
                    <ZapperContent onChangedScrollEnabled={(isEnabled)=>this._onChangeScrollEnabled(isEnabled)} navigation={this.props.navigation}/>
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
