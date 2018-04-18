
import React, {Component} from 'react';
import {StyleSheet, View, StatusBar, ImageBackground, Text, Animated, PanResponder, Image, Dimensions, FlatList, TouchableOpacity, NativeModules} from 'react-native';
import ZapperCell from '../../../components/ZapperCell'
import PinkRoundedLabel from "../../../components/PinkRoundedLabel"
import moment from 'moment'
const minTop = 70;
const {height} = Dimensions.get('window')
const maxHeight = height - 100;
const rangeHeight = maxHeight - minTop;
export default class ZapperContent extends Component {

    _movable = null;
    contentHeight = 0;
    _list = null;
    currentPosition = minTop;
    _rangeTime = 0;
    _offsetRate = 0;
    _currentTime = null;
    _timeAtMove = moment();
    constructor(props) {
        super(props);
        this.state = {
            position: minTop,
            dragging: false,
            time: ""
        };
    };

    _onPanResponderMove = (event, gestureState) => {
        this.setState({dragging: true})
        this.setPosition(this.getCurrentPosition() + gestureState.dy);
    }

    getCurrentPosition() {
        return this.currentPosition;
    }

    setCurrentPosition(newPosition) {
        let position = this.currentPosition + newPosition;
        if (position < minTop)
            return;
        if (position > maxHeight )
            return;
        let fiveMinuteMore = this._timeAtMove.add(5, 'minutes');
        this.props.getZapperContent(this._timeAtMove.toDate(), fiveMinuteMore.toDate());
        this.currentPosition += newPosition;
    }

    _onStartShouldSetPanResponder = (event) => {
        return true;
    };

    _onPanResponderRelease = (event, gestureState) => {
        this.setState({dragging: false});
        this.setCurrentPosition(gestureState.dy);
        return true;
    }

    componentWillMount(){
        this._panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: this._onStartShouldSetPanResponder,
            onMoveShouldSetPanResponderCapture: this._onStartShouldSetPanResponder,
            onPanResponderMove: this._onPanResponderMove,
            onPanResponderRelease: this._onPanResponderRelease,
        });
    }

    componentDidMount() {
        // let currentTime = moment().startOf('day');
        this._currentTime = moment();
        let time = "Today " + this._currentTime.format("HH:mm");
        console.log("Time Parse ",time);
        this.setState({time: time})
        let endOfDay = moment().endOf('day');
        this._rangeTime = moment.duration(endOfDay.diff(this._currentTime)).asMinutes();
        this._offsetRate  = rangeHeight / this._rangeTime;
        console.log("Offset Rate: ", this._offsetRate);
        let fiveMinuteMore = moment().add(5, 'minutes');
        this.props.getZapperContent(this._currentTime.toDate(), fiveMinuteMore.toDate());
    };


    _imageUri(item) {
        let image = 'https://static.telus.com/common/cms/images/tv/optik/channel-logos/79/OMNI-Pacific.gif'
        //get first Image
        if (item !== undefined) {
            image = item.videoData.originalImages[0].url;
        }
        return image;
    }

    _zapChannel = (lcn) => {
        NativeModules.STBManager.setZapWithJsonString(JSON.stringify({lCN:lcn}),(error, events) => {
            if (error) {
                console.log(error);
            } else {
                console.log(JSON.parse(events[0]))
            }
        } )
    };

    _onContentSizeChange = (width, height) => {
        console.log("Content Size: ", height)
        this.contentHeight = height;
    }

    setPosition(position) {
        if (position < minTop)
            return;
        if (position > maxHeight )
            return;
        let currentOffset = position - minTop;
        console.log("Current Offset", currentOffset);
        let periodRate = Math.round(currentOffset/this._offsetRate);
        console.log("Period Rate", periodRate);
        this._timeAtMove= moment().add(periodRate, 'minutes');
        let time = "Today " + this._timeAtMove.format("HH:mm");
        this.setState({time: time});
        this._movable.setNativeProps({
            style: [styles.floatingPinkLabel, {
                top: position,
            }]
        });
    };

    getMovableStyle = () => {
        return [styles.floatingPinkLabel, {
            top: this.state.position,
        }]
    };


    _renderItem = (item) => (
        <TouchableOpacity
            style={styles.item}
            onPress={()=>this._zapChannel(item.item.channelData.lCN)}>
            <ZapperCell image={this._imageUri(item.item)} style={{width: '100%', height: '100%'}}/>
        </TouchableOpacity>
    );
    _renderListFooter = () => (
        <View style={{width: '100%', height: Dimensions.get("window").height*0.08 + 50, backgroundColor:'transparent'}}/>
    )

    _renderEPGList() {
        const {content} = this.props;
        if (!content.data || content.isFetching) {
            return null;
        }
        return (
            <FlatList style={styles.grid}
                      data={content.data}
                      numColumns={3}
                      onContentSizeChange={this._onContentSizeChange}
                      ref={(ref) => this._list = ref}
                      showsVerticalScrollIndicator={false}
                      keyExtractor={(item, index) => index}
                      renderItem={this._renderItem}
                      ListFooterComponent={this._renderListFooter}/>
        );
    }

    render() {

        return (
            <View style={styles.root}>
                <StatusBar
                    translucent={true}
                    backgroundColor='#00000000'
                    barStyle='light-content' />
                <Animated.View
                    {...this._panResponder.panHandlers}
                    style={this.getMovableStyle()}
                    ref={(ref) => this._movable = ref} >
                    <PinkRoundedLabel style={{zIndex: 1, marginLeft: 5}} text={this.state.time}/>
                </Animated.View>
                <ImageBackground style={styles.image}
                                 source={require('../../../assets/conn_bg.png')}
                                 blurRadius={30}>
                    {this._renderEPGList()}
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
    grid: {
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: 50,
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
