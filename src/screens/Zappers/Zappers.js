/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, View, StatusBar, ImageBackground, Text, Animated, ScrollView, Image, Dimensions, FlatList, TouchableOpacity} from 'react-native';
import Orientation from 'react-native-orientation';
import {rootViewTopPadding} from '../../utils/rootViewTopPadding'
import ZapperCell from '../../components/ZapperCell'

const favoriteImg = require('../../assets/ic_favorite.png');
const allImg = require('../../assets/ic_all.png');

export default class Zappers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            channelData: [
                'a',
                'b',
                'c',
                'd',
                'e',
                'f',
            ],
            showAllChannels: true
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
        return image;
    }

    _renderItem = (item) => (<ZapperCell image={this._imageUri(item.item)}
                                         style={styles.item}/>);
    _renderListFooter = () => (
        <View style={{width: '100%', height: Dimensions.get("window").height*0.08 + 50, backgroundColor:'transparent'}}/>
    )

    _renderSwitchImage = () => {
        var imgSource = this.state.showAllChannels ? favoriteImg : allImg;
        return (
            <Image
                style={{resizeMode: 'stretch'}}
                source={imgSource}
            />
        );
    };

    _onSwitchPress = () => {
        this.setState({ showAllChannels: !this.state.showAllChannels });

        // TODO: Change datasource
    };

    render(){
        const { navigate } = this.props.navigation;
        const { channel } = this.props;
        if (!channel.data || channel.isFetching) {
            return null;
        }
        this.state.channelData = channel.data;
        return (
            <View style={styles.root}>
                <StatusBar
                    translucent={true}
                    backgroundColor='#00000000'
                    barStyle='light-content' />
                <ImageBackground style={styles.image}
                                 source={require('../../assets/conn_bg.png')}
                                 blurRadius={30}>
                    <View style={styles.controlView}>
                        <TouchableOpacity style={styles.controlButton} onPress={this._onSwitchPress}>
                            {this._renderSwitchImage()}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.controlButton}>
                            <Image source={require('../../assets/ic_sort.png')} style={{resizeMode: 'stretch'}}/>
                        </TouchableOpacity>
                    </View>
                    <FlatList style={styles.grid}
                              data={this.state.channelData}
                              numColumns={3}
                              showsVerticalScrollIndicator={false}
                              keyExtractor={(item, index) => index}
                              renderItem={this._renderItem}
                              ListFooterComponent={this._renderListFooter}/>
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
        height: '100%',
        flexDirection: 'column',
        flex: 1
    },
    controlButton: {
        aspectRatio: 1,
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    controlView: {
        paddingLeft: 20,
        paddingRight: 20,
        height: 40,
        width: '100%',
        marginTop: rootViewTopPadding() == 0 ? 24 : rootViewTopPadding(),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    grid: {
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
        ...calculateItemSize(Dimensions.get("window").width - 90, 90, 3)
    },
});
