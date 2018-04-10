/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, View, StatusBar, ImageBackground, Text, Animated, ScrollView, Image, Dimensions, FlatList, TouchableOpacity, NativeModules} from 'react-native';
import Orientation from 'react-native-orientation';
import {rootViewTopPadding} from '../../utils/rootViewTopPadding'
import ZapperCell from '../../components/ZapperCell'
import ChannelModal from "./ChannelModal/ChannelModal";

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
            showAllChannels: true,
            favoriteChannels: [],
            allChannels: []
        };
        this.channelModal = null;
        this.stbManager = NativeModules.STBManager;
    };

    componentWillMount() {
        //Orientation.lockToPortrait();
    };

    componentDidMount() {
        this.props.getChannel(-1);
    };

    _imageUri(item) {
        var image = 'https://static.telus.com/common/cms/images/tv/optik/channel-logos/79/OMNI-Pacific.gif'
        if (item.image !== undefined) {
            image = item.image;
        }
        return image;
    }

    _showChannelModal = (item) => {
        var index = 0;
        for (var i = 0; i < this.state.channelData.length; i++) {
            if (this.state.channelData[i].serviceID === item.serviceID) {
                index = i;
                break;
            }
        }
        this.channelModal.state.currentIndex = index;
        this.channelModal.state.currentTitle = this.state.channelData[index].serviceName;
        this.channelModal.state.currentDescription = this.state.channelData[index].shortDescription;
        this.channelModal.state.currentFavorite = (this.state.channelData[index].favorite === 0) ? "Favorite" : "Unfavorite";
        this.channelModal.toggleModal();
    };

    _zapChannel = (item) => {
        // NativeModules.STBManager.setZapWithJsonString(JSON.stringify({lCN:lcn}),(error, events) => {
        //     if (error) {
        //         console.log(error);
        //     } else {
        //         console.log(JSON.parse(events[0]))
        //     }
        // } )
        this.props.navigation.navigate("ZapperContent", {serviceId: item.serviceID})
    };

    _renderItem = (item) => (<TouchableOpacity onLongPress={() => this._showChannelModal(item.item)}
                                               style={styles.item}
                                               onPress={()=>this._zapChannel(item.item)}>
        <ZapperCell image={this._imageUri(item.item)} style={{width: '100%', height: '100%'}}/>
    </TouchableOpacity>);
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

    _favoriteItem = (serviceId, isFavorite) => {
        var index = 0;
        for (var i = 0; i < this.state.allChannels.length; i++) {
            if (this.state.allChannels[i].serviceID === serviceId) {
                index = i;
                break;
            }
        }
        this.state.allChannels[index].favorite = isFavorite ? 1 : 0;

        NativeModules.STBManager.setServiceWithJsonString(JSON.stringify(this.state.allChannels[index]), (error, events)=>{});

        for (var i = 0; i < this.state.channelData.length; i++) {
            if (this.state.channelData[i].serviceID === serviceId) {
                index = i;
                break;
            }
        }
        this.state.channelData[i].favorite = isFavorite ? 1 : 0;
        this._filterFavoriteChannel();


        var newData = this.state.allChannels;
        if (!this.state.showAllChannels) {
            newData = this.state.favoriteChannels;
            this.channelModal.setState({currentFavorite: "Unfavorite"});
            if (newData.length === 1) {
                this.channelModal.setState({currentIndex: 0});
            }
        } else {
            this.channelModal.setState({currentFavorite: this.channelModal.state.currentFavorite === "Favorite" ? "Unfavorite" : "Favorite"});
        }

        if (newData === null || newData.length === 0) {
            this.channelModal.setState({isShow: false});
        }

        this.setState({channelData: newData});
    };

    _onSwitchPress = () => {
        let newData = this.state.allChannels;
        if (this.state.showAllChannels) {
            newData = this.state.favoriteChannels;
        }
        this.setState({showAllChannels: !this.state.showAllChannels, channelData: newData});
        // TODO: Change datasource
    };

    _filterFavoriteChannel = () => {
        this.state.favoriteChannels = this.state.allChannels.filter(channel => channel.favorite === 1);
    };

    render() {
        const {channel} = this.props;
        if (!channel.data || channel.isFetching) {
            return null;
        }
        this.state.channelData = channel.data;
        this.state.allChannels = channel.data;
        this._filterFavoriteChannel();
        return (
            <View style={styles.root}>
                <StatusBar
                    translucent={true}
                    backgroundColor='#00000000'
                    barStyle='light-content' />
                <ChannelModal ref={(modal) => this.channelModal = modal} channels={this.state.channelData} onFavoriteItem={this._favoriteItem}/>
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
    return {width: (contentWidth-60)/3, margin: 10}

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
        paddingLeft: 30,
        paddingRight: 30,
        width: '100%'
    },

    contentGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingBottom: 100
    },
    item: {
        aspectRatio: 1,
        ...calculateItemSize(Dimensions.get("window").width - 60, 90, 0)
    },
});
