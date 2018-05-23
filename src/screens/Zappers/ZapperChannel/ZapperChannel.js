/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet, View, StatusBar, ImageBackground, Text, Animated, ScrollView, Image, Dimensions, FlatList,
    TouchableOpacity, NativeModules, Platform, InteractionManager, ActivityIndicator, DeviceEventEmitter
} from 'react-native';
import Orientation from 'react-native-orientation';
import _ from 'lodash';
import {rootViewTopPadding} from '../../../utils/rootViewPadding'
import ZapperCell from '../../../components/ZapperCell'
import ChannelModal from "../ChannelModal/ChannelModal";
import {colors} from "../../../utils/themeConfig";
import IndicatorModal from "../../../components/IndicatorModal";
import AlertModal from "../../../components/AlertModal";

const favoriteImg = require('../../../assets/ic_favorite.png');
const allImg = require('../../../assets/ic_all.png');
const imgBackground = require('../../../assets/conn_bg.png');

export default class ZapperChannel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            channelData: [],
            showAllChannels: true,
            favoriteChannels: [],
            allChannels: [],
            alreadyNavigated: true,
            zapIndex: 0,
        };
        this.indicatorModal = null;
        this.alertModal = null;
        this.channelModal = null;
        this.stbManager = NativeModules.STBManager;
    };

    componentWillMount() {
        Orientation.lockToPortrait();
    };

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.getChannel(-1);
        })
    };

    componentWillUnmount() {
        this._navListener.remove();
    }

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
        const {channel} = this.props;
        this.setState({
            zapIndex: channel.data != null ? channel.data.findIndex(x => x.serviceID === item.serviceID) : 0
        })
        this.setState({alreadyNavigated: false});
        this.props.getLiveEpgInZapper(true, channel.data != null ? channel.data.map(x => x.serviceID) : []);
        NativeModules.STBManager.setZapWithJsonString(JSON.stringify({lCN:item.lCN}),(error, events) => {
            if (error) {
                console.log(error);
            } else {
                console.log(JSON.parse(events[0]));
            }
        } )
    };

    _renderItem = (item) => (<TouchableOpacity onLongPress={() => this._showChannelModal(item.item)}
                                               style={styles.item}
                                               onPress={()=>this._zapChannel(item.item)}>
        <ZapperCell image={this._imageUri(item.item)} style={{width: '100%', height: '100%'}}/>
    </TouchableOpacity>);
    _renderListFooter = () => (
        <View style={{
            width: '100%',
            height: Dimensions.get("window").height * 0.08 + 50,
            backgroundColor: 'transparent'
        }}/>
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
        let index = _.findIndex(this.state.allChannels, {'serviceID': serviceId});
        let newFavorite = _.cloneDeep(this.state.allChannels[index]);
        newFavorite.favorite = isFavorite ? 1 : 0;
        let newAllChannels = _.cloneDeep(this.state.allChannels);
        newAllChannels.splice(index, 1, newFavorite);
        this.state.allChannels = newAllChannels;

        NativeModules.RNUserKit.storeProperty("favorite_channels", {data: this.state.allChannels}, (error, events) => {
        });

        index = _.findIndex(this.state.channelData, {'serviceID': serviceId});
        let newChannelData = _.cloneDeep(this.state.channelData);
        newChannelData.splice(index, 1, newFavorite);
        this.state.channelData = newChannelData

        this._filterFavoriteChannel();

        let newData = this.state.allChannels;
        let currentIndex = this.channelModal.state.currentIndex;
        let currentFavorite = this.channelModal.state.currentFavorite === "Favorite" ? "Unfavorite" : "Favorite";
        if (!this.state.showAllChannels) {
            newData = this.state.favoriteChannels;

            if (currentIndex == 0) {
                if (currentIndex + 1 < this.state.channelData.length && currentIndex + 1 >= 0) {
                    this.channelModal.setState({currentTitle: this.channelModal.props.channels[currentIndex + 1].serviceName,
                        currentDescription: this.channelModal.props.channels[currentIndex + 1].shortDescription});
                }
            } else {
                if (currentIndex - 1 < this.state.channelData.length && currentIndex - 1 >= 0) {
                    this.channelModal.setState({currentTitle: this.channelModal.props.channels[currentIndex - 1].serviceName,
                        currentDescription: this.channelModal.props.channels[currentIndex - 1].shortDescription});
                }
                this.channelModal.carousel.snapToPrev();
            }
            currentFavorite = "Unfavorite";
        }

        if (newData === null || newData.length === 0) {
            this.channelModal.setState({isShow: false, currentFavorite: currentFavorite});
        } else {
            this.channelModal.setState({currentFavorite: currentFavorite});
        }
        this.setState({channelData: newData})
    };

    _navigateToControlPage = (array) => {
        const {navigation} = this.props;
        const {zapIndex} = this.state;
        this.setState({alreadyNavigated: true});
        console.log('Array', array, zapIndex);
        if (Platform.OS !== 'ios') {
            NativeModules.RNControlPageNavigation
                .navigateControl(array,
                    zapIndex,
                    true,
                    true, // Use true at isFromBanner because similar behavior
                    true,
                    () => { console.log("onDismiss") },
                    () => { console.log("onDetail") });
        }
        else {
            navigation.navigate('VideoControlModal', {
                item: array[zapIndex],
                epg: array,
                isLive: true
            })
        }
    };

    componentWillReceiveProps(nextProps) {
        const {epg} = nextProps;
        console.log('ReceiveProps', epg);
        if (this.state.alreadyNavigated === false && epg.isFetching === false && epg.data != null && epg.data.length != 0) {
            this._navigateToControlPage(epg.data);
        }
    }

    _onSwitchPress = () => {
        let newData = this.state.allChannels;
        if (this.state.showAllChannels) {
            newData = this.state.favoriteChannels;
        }
        this.setState({showAllChannels: !this.state.showAllChannels, channelData: newData});
    };

    _filterFavoriteChannel = () => {
        this.state.favoriteChannels = this.state.allChannels.filter(channel => channel.favorite === 1);
    };

    onDismissIndicatorModal() {
        //this.alertModal.setState({isShow: true});
    }

    render() {
        const {channel, epg} = this.props;
        if (channel.isFetching) {
            return (<View style={styles.root}>
                <ImageBackground style={{flex:1, justifyContent:'center', alignItems:'center'}}
                                 source={imgBackground}
                                 blurRadius={30}>
                    <ActivityIndicator size="large" color={colors.whitePrimary}/>
                </ImageBackground>
            </View>)
        }

        if (!channel.data) {
            return (<View style={styles.root}>
                <ImageBackground style={styles.image}
                                 source={imgBackground}
                                 blurRadius={30}>
                    <Text style={styles.errorMessage}>You must connect to STB first</Text>
                </ImageBackground>
            </View>)
        }

        if (this.state.allChannels.length === 0) {
            this.state.allChannels = _.cloneDeep(channel.data);
            this._filterFavoriteChannel();
            if (this.state.showAllChannels) {
                this.state.channelData = _.cloneDeep(channel.data);
            } else {
                this.state.channelData = this.state.favoriteChannels;
            }
        }
        if (epg.isFetching === true && this.indicatorModal != null) {
            this.indicatorModal.state.isShow = true;
        }
        if (epg.isFetching === false && this.indicatorModal != null) {
            this.indicatorModal.state.isShow = false;
        }
        if (epg.isFetching === false && epg.isFetched === true && this.indicatorModal != null) {
            if (epg.data == null || epg.data.length === 0) {
                this.alertModal.state.message = "Channel is offline";
                this.alertModal.state.isShow = true;
            }
        }

        return (
            <View style={styles.root}>
                <StatusBar
                    translucent={true}
                    backgroundColor='#00000000'
                    barStyle='light-content'/>
                <IndicatorModal ref={(ref) => this.indicatorModal = ref} onDismiss={this.onDismissIndicatorModal.bind(this)}/>
                <AlertModal ref={(ref) => this.alertModal = ref}/>
                <ChannelModal ref={(modal) => this.channelModal = modal} channels={this.state.channelData}
                              onFavoriteItem={this._favoriteItem}/>
                <ImageBackground style={styles.image}
                                 source={imgBackground}
                                 blurRadius={30}>
                    <View style={styles.controlView}>
                        <TouchableOpacity style={styles.controlButton} onPress={this._onSwitchPress}>
                            {this._renderSwitchImage()}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.controlButton}>
                            <Image source={require('../../../assets/ic_sort.png')} style={{resizeMode: 'stretch'}}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.gridContainer}>
                    <FlatList
                              data={this.state.channelData}
                              numColumns={3}
                              showsVerticalScrollIndicator={false}
                              keyExtractor={(item, index) => index}
                              renderItem={this._renderItem}
                              refreshing={channel.isFetching}
                              onRefresh={() => this.props.getChannel(-1)}
                              ListFooterComponent={this._renderListFooter}/>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

calculateItemSize = (contentWidth, maxItemSize, minimumItem) => {
    return {width: (contentWidth - 60) / 3, margin: 10}

};

const styles = StyleSheet.create({
    errorMessage: {
        marginTop: 100,
        color: colors.whiteBackground,
        fontSize: 20,
        width: '100%',
        paddingHorizontal: 40,
        textAlign: 'center'
    },
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
    gridContainer: {
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        width:'100%'
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
