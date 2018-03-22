/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, View, StatusBar, ImageBackground, Text, Animated, ScrollView, ListView, Image, Dimensions} from 'react-native';
import Orientation from 'react-native-orientation';
import {rootViewTopPadding} from '../../utils/rootViewTopPadding'
import ZapperCell from '../../components/ZapperCell'

export default class Zappers extends Component {

    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
        this.state = {
            channelData: this.dataSource.cloneWithRows([
                'a',
                'b',
                'c',
                'd',
                'e',
                'f',
            ])
        };
    };

    componentWillMount() {
        Orientation.lockToPortrait();
    };

    componentDidMount() {
        this.props.getChannel(-1);
    };

    _imageUri(item) {
        var image = 'https://static.telus.com/common/cms/images/tv/optik/channel-logos/79/OMNI-Pacific.gif'
        if (item.originalImages != undefined && item.originalImages.length > 0) {
            image = item.originalImages[0].url;
        }
        console.log("Get image",image);
        return image;
    }

    render(){
        const { navigate } = this.props.navigation;
        const { channel } = this.props;
        if (!channel.data || channel.isFetching) {
            return null;
        }
        console.log("Channel data:",channel.data);
        this.state.channelData = this.dataSource.cloneWithRows(channel.data);
        return (
            <View style={styles.root}>
                <StatusBar
                    translucent={true}
                    backgroundColor='#00000000'
                    barStyle='light-content' />
                <ImageBackground style={styles.image}
                                 source={require('../../assets/conn_bg.png')}
                                 blurRadius={30}>
                    <ListView contentContainerStyle={styles.contentGrid}
                              style={styles.grid}
                              dataSource={this.state.channelData}
                              renderRow={(rowData) => <ZapperCell image={this._imageUri(rowData)}
                                                                  style={styles.item}/>}/>
                </ImageBackground>
            </View>
        );
    }
}

calculateItemSize = (contentWidth, maxItemSize, minimumItem) => {


    var _contentWidth = contentWidth;
    var _maxItemSize = maxItemSize;
    var _minimumItem = minimumItem;

    // Increase number of item
    while (true) {
        if ((_contentWidth - _maxItemSize * _minimumItem) / _minimumItem > 20) {
            _minimumItem++;
            continue;
        }
        if (_contentWidth - _maxItemSize * _minimumItem < 5) {
            _maxItemSize -= 5;
            continue;
        }
        break;
    }
    let _width = _maxItemSize;
    let _margin = (_contentWidth - _maxItemSize * _minimumItem) / (2*_minimumItem);
    console.log( "Item size: ",_width, _margin);
    return {width: _width, margin: _margin}

};

const styles = StyleSheet.create({
    root: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#747474'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    grid: {
        top: rootViewTopPadding() == 0 ? 24 : rootViewTopPadding(),
        paddingLeft: 40,
        paddingRight: 40,
        width: '100%'
    },
    contentGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingBottom: 100
    },
    item: {
        aspectRatio: 1,
        ...calculateItemSize(Dimensions.get("window").width - 90, 100, 3)
    },
});
