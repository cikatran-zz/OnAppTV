
import React, {Component} from 'react';
import {StyleSheet, View, StatusBar, ImageBackground, Text, Animated, PanResponder, Image, Dimensions, FlatList, TouchableOpacity, NativeModules} from 'react-native';
import Orientation from 'react-native-orientation';
import {rootViewTopPadding} from '../../../utils/rootViewTopPadding'
import ZapperCell from '../../../components/ZapperCell'
import ChannelModal from "../ChannelModal/ChannelModal";
import PinkRoundedLabel from "../../../components/PinkRoundedLabel"
import {
    PanGestureHandler,
    State,
} from 'react-native-gesture-handler';

const icClose = require('../../../assets/ic_modal_close.png');
const minTop = 70;

export default class ZapperContent extends Component {

    _movable = null;
    contentHeight = 0;
    layoutHeight = 0;
    _list = null;
    currentPosition = minTop;
    constructor(props) {
        super(props);
        this.state = {
            channelData: [],
            showAllChannels: true,
            favoriteChannels: [],
            allChannels: [],
            position: minTop,
            dragging: false
        };
        this._translateY = new Animated.Value(0);
        this.channelModal = null;
        this._lastOffsetY = minTop;
    };

    _onPanResponderMove = (event, gestureState) => {

        this.setState({dragging: true})
        this.handleScrollviewPanresponder();
        this.setPosition(this.getCurrentPosition() + gestureState.dy);
        console.log("Move", (this.contentHeight/height)*gestureState.dy);
        console.log("Dy", gestureState.dy);
        console.log("h", height)
        this.scrollList((this.contentHeight/height)*gestureState.dy)
    }




    _onGestureEvent() {
        // const {height} = Dimensions.get("window");
        // this.scrollList((this.contentHeight/height)*event.nativeEvent.dy)
        return Animated.event(
            [
                {
                    nativeEvent: {
                        translationY: this._translateY,
                    },
                },
            ],
            {useNativeDriver: true}
        )
    };
    getCurrentPosition() {
        return this.currentPosition;
    }

    setCurrentPosition(newPosition) {
        this.currentPosition += newPosition;
    }

    scrollList(position) {
        console.log("Scroll List: ", position)
        this._list.scrollToOffset({x:0, y:position, animated: true});
    }

    _onStartShouldSetPanResponder = (event) => {
        return true;
    };

    _onPanResponderRelease = (event, gestureState) => {
        this.setState({dragging: false});
        this.setCurrentPosition(gestureState.dy);
        return true;
    }

    _listOnStartShouldSetPanResponder = (event) => {
        console.log("List Set Pan");
        return false;
    }

    _onHandlerStateChange = event => {
        console.log("Change State")
        const {width, height} = Dimensions.get("window");
        if (event.nativeEvent.oldState === State.ACTIVE) {
            this._lastOffsetY += event.nativeEvent.translationY;
            this._translateY.setOffset(this._lastOffsetY);
            this._translateY.setValue(0);
        }
    };

    componentWillMount(){
    }

    componentDidMount() {
        // const {params} = this.props.navigation.state;
        // this.props.getZapperContent(params.serviceId);
        // this.listener = this._lastOffsetY.addListener((_lastOffsetY) => {
        //     this._list.scrollTo({
        //         y: _lastOffsetY,
        //         animated: false
        //     });
        // });
    };

    // componentWillUnmount() {
    //     this._lastOffsetY.removeListener(this.listener);
    // }

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

    _onContentSizeChange = (width, height) => {
        console.log("Content Size: ", height)
        this.contentHeight = height;
    }

    _handleScroll = (event) => {
        console.log("Scroll", event.nativeEvent.contentOffset.y);
        console.log("Content H", event.nativeEvent.contentSize.height);
        if (!this.state.dragging) {
            let offsetY = event.nativeEvent.contentOffset.y;
            let contentHeight = event.nativeEvent.contentSize.height;
            let layoutHeight = event.nativeEvent.layoutMeasurement.height;
            let position = minTop + offsetY * (layoutHeight / contentHeight)
            this.setPosition(position);
            this.setCurrentPosition(position);
        }
    }


    _onScrollviewStartPanResponder = () => {
        const {dragging} = this.state;
        return dragging
    }
    handleScrollviewPanresponder(){
        // Tell ListView not to give up the gesture so easy
        Object.assign(this._list.getScrollResponder(), {
            scrollResponderHandleStartShouldSetResponder: this._onScrollviewStartPanResponder,
            scrollResponderHandleTerminationRequest: this._onScrollviewStartPanResponder
        });
    }

    setPosition(position) {
        this._movable.setNativeProps({
            style: [styles.floatingPinkLabel, {
                top: position,
            }]
        });
    };

    getMovableStyle = () => {
        return [styles.floatingPinkLabel, {
            transform: [
                {translateY: this._translateY}
            ]}
        ]
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
                <PanGestureHandler
                    onHandlerStateChange={this._onHandlerStateChange}
                    onGestureEvent={this._onGestureEvent()} >
                    <Animated.View
                        style={this.getMovableStyle()}
                        ref={(ref) => this._movable = ref} >
                        <PinkRoundedLabel style={{zIndex: 1, marginLeft: 5}} text="Today 19:00"/>
                    </Animated.View>
                </PanGestureHandler>
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
                              onContentSizeChange={this._onContentSizeChange}
                              ref={(ref) => this._list = ref}
                              onScroll={this._handleScroll}
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
    floatingPinkLabel: {
        position: 'absolute',
        left: 0,
        top: minTop,
        zIndex: 200,
    }
});
