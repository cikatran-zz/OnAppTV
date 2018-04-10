
import React, {Component} from 'react';
import {StyleSheet, View, StatusBar, ImageBackground, Text, Animated, ScrollView, Image, Dimensions, FlatList, TouchableOpacity, NativeModules} from 'react-native';
import Orientation from 'react-native-orientation';
import {rootViewTopPadding} from '../../../utils/rootViewTopPadding'
import ZapperCell from '../../../components/ZapperCell'
import ChannelModal from "../ChannelModal/ChannelModal";

const icClose = require('../../../assets/ic_modal_close.png');

export default class Zappers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            channelData: [],
            showAllChannels: true,
            favoriteChannels: [],
            allChannels: []
        };
        this.channelModal = null;
    };

    componentWillMount() {
        //Orientation.lockToPortrait();
    };

    componentDidMount() {
        const {params} = this.props.navigation.state;
        this.props.getZapperContent(params.serviceId);
    };

    _imageUri(item) {
        let image = 'https://static.telus.com/common/cms/images/tv/optik/channel-logos/79/OMNI-Pacific.gif'
        //get first Image
        if (item !== undefined) {
            image = item.videoData.originalImages[0].url;
        }
        return image;
    }

    _showChannelModal = (item) => {
        let index = 0;
        for (let i = 0; i < this.state.channelData.length; i++) {
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

    _zapChannel = (lcn) => {
        // NativeModules.STBManager.setZapWithJsonString(JSON.stringify({lCN:lcn}),(error, events) => {
        //     if (error) {
        //         console.log(error);
        //     } else {
        //         console.log(JSON.parse(events[0]))
        //     }
        // } )
    };

    _renderItem = (item) => (<TouchableOpacity onLongPress={() => this._showChannelModal(item.item)}
                                               style={styles.item}
                                               onPress={()=>this._zapChannel(item.item.lCN)}>
        <ZapperCell image={this._imageUri(item.item)} style={{width: '100%', height: '100%'}}/>
    </TouchableOpacity>);
    _renderListFooter = () => (
        <View style={{width: '100%', height: Dimensions.get("window").height*0.08 + 50, backgroundColor:'transparent'}}/>
    )

    render() {
        const {content, navigation} = this.props;
        if (!content.data || content.isFetching) {
            return null;
        }
        const {epgsData} = content.data;
        if (!epgsData)
            return null;
        return (
            <View style={styles.root}>
                <StatusBar
                    translucent={true}
                    backgroundColor='#00000000'
                    barStyle='light-content' />
                <ImageBackground style={styles.image}
                                 source={require('../../../assets/conn_bg.png')}
                                 blurRadius={30}>
                    <View style={styles.controlView}>
                        <TouchableOpacity style={styles.controlButton} onPress={() => navigation.goBack()}>
                            <Image source={icClose} style={{resizeMode: 'stretch', height: 30, width: 30}}/>
                        </TouchableOpacity>
                    </View>
                    <FlatList style={styles.grid}
                              data={epgsData}
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
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    controlView: {
        paddingLeft: 20,
        paddingRight: 20,
        height: 40,
        width: '100%',
        marginTop: rootViewTopPadding() === 0 ? 24 : rootViewTopPadding(),
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
