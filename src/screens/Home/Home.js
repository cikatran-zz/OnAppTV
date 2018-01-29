/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {FlatList, Image, StyleSheet, Text, View, ScrollView, ImageBackground} from 'react-native';
import PinkRoundedLabel from '../../components/PinkRoundedLabel';
import {colors} from '../../utils/themeConfig'

export default class App extends Component {

    constructor(props) {
        super(props);
    };

    componentDidMount() {
        this.props.getBanner();
        this.props.getChannel();
    };

    _renderChannelList = ({item}) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemImageContainer}>
                <Image
                  style={styles.itemImage}
                  resizeMode={'cover'}
                  source={{uri: 'http://www.direct-vs-dish.com/media/channel_logos/180px-CN_logo.svg_-e1314879342640.png.300x300_q85.png'}}/>
            </View>
            <Text
              numberOfLines={1}
              style={styles.itemLabel}>{item.title}</Text>
        </View>
    )

    _keyExtractor = (item, index) => item.id;


    render() {
        const {banner, channel} = this.props;
        if (!banner.data || banner.isFetching || !channel.data || channel.isFetching)
            return null;
        return (
            <ScrollView style={styles.container}>
                <View style={styles.bannerContainer}>
                    <Image
                        style={styles.bannerImage}
                        source={{uri: banner.data.header_banner.cover_image}}/>
                    <View style={styles.labelGroup}>
                        <PinkRoundedLabel text="New Movie"/>
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
                    showsHorizontalScrollIndicator={false}
                    data={channel.data}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderChannelList}
                />
                <ImageBackground style={styles.adsContainer} source={{uri: 'https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'}}>
                    <View style={styles.adsLabelContainer}>
                    <PinkRoundedLabel text="+10.00$/MONTH"/>
                    </View>
                </ImageBackground>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: colors.screenBackground,
    },
    bannerContainer: {
        width: '100%',
        aspectRatio: 1.3,
        justifyContent: 'center',
    },
    adsContainer: {
        width: '100%',
        aspectRatio: 1.3,
    },
    adsLabelContainer: {
        position: 'absolute',
        top: 20,
        left: 10,
    },
    labelGroup: {
        bottom: 20,
        right: 20,
        position: 'absolute',
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    bannerTitle: {
        marginTop: 10,
        fontSize: 15,
        color: colors.textWhitePrimary
    },
    bannerSubtitle: {
        marginTop: 5,
        fontSize: 12,
        color: colors.textGrey
    },
    bannerImage: {
        width: '100%',
        height: '100%'
    },
    bannerPlayIconGroup: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignSelf: 'center',
        justifyContent: 'center'
    },
    bannerPlayIconBackground: {
        borderRadius: 50,
        backgroundColor: colors.mainDarkGrey,
        width: '100%',
        height: '100%'
    },
    bannerPlayIcon: {
        position: 'absolute',
        width: '100%',
        height: '80%'
    },
    listHorizontal: {
        marginVertical: 30
    },
    itemLabel: {
        fontSize: 12,
        color: colors.textDarkGrey
    },
    itemContainer: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemImageContainer: {
        justifyContent: 'center',
        alignItems:'center',
        borderRadius: 10,
        backgroundColor: colors.mainLightGrey,
        width: 80,
        height: 80,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    }
});
