/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {FlatList, Image, Platform, StyleSheet, Text, View} from 'react-native';

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
        this.props.getChannel();
    };

    render() {
        const {banner} = this.props;
        if (!banner.data || banner.isFetching)
            return null;
        const {channel} = this.props;
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
                    <View style={styles.bannerPlayIconGroup}>
                        <View
                            blurRadius={15}
                            source={{uri: ''}}
                            style={styles.bannerPlayIconBackground}/>
                        <Image
                            resizeMode={'contain'}
                            style={styles.bannerPlayIcon}
                            source={{uri: 'https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_play_arrow_48px-512.png'}}/>

                    </View>
                </View>
                <FlatList
                    style={styles.listHorizontal}
                    horizontal={true}
                    data={[
                        {key: 'Devin'},
                        {key: 'Jackson'},
                        {key: 'James'},
                        {key: 'Joel'},
                        {key: 'John'},
                        {key: 'Jillian'},
                        {key: 'Jimmy'},
                        {key: 'Julie'},
                    ]}
                    renderItem={({item}) =>
                        <View style={styles.itemContainer}>
                            <Image
                                resizeMode={'cover'}
                                style={styles.itemImage}
                                source={{uri: channel.data.header_banner.cover_image}}/>
                            <Text style={styles.itemLabel}>{item.key}</Text>
                        </View>}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    bannerContainer: {
        width: '100%',
        aspectRatio: 1.3,
        justifyContent: 'center',
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
    },
    bannerPlayIconGroup: {
        position: 'absolute',
        width: 80,
        height: 80,
        alignSelf: 'center',
        justifyContent: 'center'
    },
    bannerPlayIconBackground: {
        borderRadius: 50,
        backgroundColor: '#9fbda9',
        width: '100%',
        height: '100%'
    },
    bannerPlayIcon: {
        position: 'absolute',
        width: '100%',
        height: '80%'
    },
    listHorizontal: {
        marginTop: 30,
        marginBottom: 30
    },
    itemLabel: {
        padding: 10,
        fontSize: 18,
        height: 44,
        color: '#000000'
    },
    itemContainer: {
        width: 128,
        height: 128,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemImage: {
        alignItems: 'center',
        borderRadius: 10,
        width: 100,
        height: 100,
    },
});
