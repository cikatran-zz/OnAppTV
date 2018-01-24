/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {Image, Platform, StyleSheet, Text, View} from 'react-native';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
    android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {

    constructor(props) {
        super(props);
    };

    componentDidMount() {
        this.props.getBanner();
    };

    render() {
        const {banner} = this.props;
        if (!banner.data || banner.isFetching)
            return null;
        return (
            <View style={styles.container}>
                <View style={styles.bannerContainer}>
                    <Image
                        style={styles.bannerImage}
                        source={{uri: banner.data.header_banner.cover_image}}/>
                    <View style={styles.labelGroup}>
                        <Text style={styles.bannerCategory}>
                            New Movie
                        </Text>
                        <Text style={styles.bannerTitle}>
                            {banner.data.header_banner.title}
                        </Text>
                        <Text style={styles.bannerSubtitle}>
                            {banner.data.header_banner.sub_title}
                        </Text>
                    </View>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    bannerContainer: {
        width: '100%',
        aspectRatio: 1.3
    },
    labelGroup: {
        bottom: 20,
        right: 20,
        position: 'absolute',
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    bannerCategory: {
        borderRadius: 20,
        padding: 10,
        backgroundColor: '#ff4061',
        fontSize: 18,
        color: '#FFFFFF'
    },
    bannerTitle: {
        marginTop: 15,
        fontSize: 18,
        color: '#ffffff'
    },
    bannerSubtitle: {
        marginTop: 5,
        fontSize: 14,
        color: '#565355'
    },
    bannerImage: {
        width: '100%',
        height: '100%'
    }
});
