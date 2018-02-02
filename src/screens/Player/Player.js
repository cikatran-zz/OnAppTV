import React, {Component} from 'react';
import Swiper from 'react-native-swiper'
import VerticalViewPager from 'react-native-vertical-view-pager';
import {Image, StyleSheet, View, ViewPagerAndroid, Dimensions, Platform, StatusBar} from 'react-native';
import { BlurView, VibrancyView } from 'react-native-blur';

export default class Player extends Component {
    constructor(props) {
        super(props);
    };

    componentDidMount() {

    }

    render() {
        return (
            <VerticalViewPager bounces={false} showsVerticalScrollIndicator={false}>
                <StatusBar
                    translucent={true}
                    backgroundColor='#00000000'
                    barStyle='light-content'>

                </StatusBar>

                <View style={styles.pageContainer}>
                    <Image
                        style={styles.topImage}
                        source={{uri: 'https://i.ytimg.com/vi/qL1yiG_1GNI/maxresdefault.jpg'}}/>
                    <Image
                        style={styles.belowImage}
                        source={{uri: 'https://i.ytimg.com/vi/qL1yiG_1GNI/maxresdefault.jpg'}}/>
                </View>
                <View style={styles.pageContainer}></View>

            </VerticalViewPager>
        )
    }
}

const {width, height} = Dimensions.get("window");

const styles = StyleSheet.create({
    topImage: {
        resizeMode: 'cover',
        width: '100%',
        height: '40%'
    },
    belowImage: {
        resizeMode: 'cover',
        width: '100%',
        height: '60%'
    },
    pageContainer: {
        width: width,
        height: height
    }
})