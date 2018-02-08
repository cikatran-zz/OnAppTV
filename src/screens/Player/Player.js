import React, {Component} from 'react';
import Swiper from 'react-native-swiper'
import VerticalViewPager from 'react-native-vertical-view-pager';
import {Image, StyleSheet, View, ViewPagerAndroid, Dimensions, Platform, StatusBar} from 'react-native';
import BrightcovePlayer from '../../components/BrightcovePlayer'

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
                    <BrightcovePlayer
                        style={{width:'100%', height:'100%'}}
                        videoId='5714823997001'
                        accountId='5706818955001'
                        policyKey='BCpkADawqM13qhq60TadJ6iG3UAnCE3D-7KfpctIrUWje06x4IHVkl30mo-3P8b7m6TXxBYmvhIdZIAeNlo_h_IfoI17b5_5EhchRk4xPe7N7fEVEkyV4e8u-zBtqnkRHkwBBiD3pHf0ua4I'/>
                </View>
                <View style={styles.pageContainer}></View>

            </VerticalViewPager>
        )
    }
}

{/*<BrightcovePlayer*/}
    {/*style={{width:'100%', height:'100%'}}*/}
    {/*videoId='5723698349001'*/}
    {/*accountId='5241932513001'*/}
    {/*policyKey='BCpkADawqM2nPgviDdx5RqQbh0sU6Fagg8tYOd8HeRrO3CukX-ZTKEJV9VVtj4tPR5gUDxCC9iMZMswS6uy1S358GkPJtfZJCDamJd2g1_vzSXJmSGmOKUbYBHcBN5BNRxE3lXIag8uqVNJB'/>
{/*<BrightcovePlayer*/}
    {/*style={{width:'100%', height:'100%'}}*/}
    {/*videoId='5714823997001'*/}
    {/*accountId='5706818955001'*/}
    {/*policyKey='BCpkADawqM13qhq60TadJ6iG3UAnCE3D-7KfpctIrUWje06x4IHVkl30mo-3P8b7m6TXxBYmvhIdZIAeNlo_h_IfoI17b5_5EhchRk4xPe7N7fEVEkyV4e8u-zBtqnkRHkwBBiD3pHf0ua4I'/>*/}

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