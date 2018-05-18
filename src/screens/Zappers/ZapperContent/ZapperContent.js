
import React, {Component} from 'react';
import {
  StyleSheet, View, StatusBar, ImageBackground, ActivityIndicator, Animated, PanResponder,
  Text, Image, Dimensions, FlatList, TouchableOpacity, NativeModules, Modal
} from 'react-native'
import ZapperCell from '../../../components/ZapperCell';
import PinkRoundedLabel from "../../../components/PinkRoundedLabel";
import {colors} from "../../../utils/themeConfig";
import moment from 'moment';
import { getBlurRadius } from '../../../utils/blurRadius'
import BlurView from '../../../components/BlurView'
import { rootViewTopPadding } from '../../../utils/rootViewPadding'
import IndicatorModal from "../../../components/IndicatorModal";
import AlertModal from "../../../components/AlertModal";
import {getImageFromArray} from '../../../utils/images'

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
    alertVC = null
    constructor(props) {
        super(props);
        this.state = {
            position: minTop,
            dragging: false,
            time: "",
            recordModalVisibility: false
        };
    };

    _onPanResponderMove = (evt, gestureState) => {
        if (evt.nativeEvent.pageY < minTop) {
            this.setState({dragging: false})
            this.props.onChangedScrollEnabled(true);
            return;
        }

        if (evt.nativeEvent.pageY > maxHeight ) {
            this.setState({dragging: false})
            this.props.onChangedScrollEnabled(true);
            return;
        }

        if (Math.abs(gestureState.dy) < 10) {
            this.setState({dragging: false})
            this.props.onChangedScrollEnabled(true);
            return;
        }
        console.log("Event", evt.nativeEvent);
        this.setState({dragging: true})
        this.props.onChangedScrollEnabled(false);
        this.setPosition(evt.nativeEvent.pageY);
    };

    getCurrentPosition() {
        return this.currentPosition;
    }

    setCurrentPosition(position) {

        let temp = moment(this._timeAtMove.toDate());
        let fiveMinuteMore = temp.add(5, 'minutes');
        this.props.getZapperContent(this._timeAtMove.toISOString(true), fiveMinuteMore.toISOString(true));
    }

    _onStartShouldSetPanResponder = (event) => {
        return true;
    };

    _onPanResponderRelease = (evt, gestureState) => {
        this.setState({dragging: false});
        this.props.onChangedScrollEnabled(true);
        this.setCurrentPosition(evt.nativeEvent.pageY);
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
        //Temporary hard set time to 1/5/2018 8:00 AM
        this._currentTime = moment("May 1 08:00:00", "MMM DD hh:mm:ss");
        let time = "Now";
        this.setState({time: time})
        let endOfDay = moment("May 1 08:00:00", "MMM DD hh:mm:ss").endOf('day');
        console.log("Current Time: ", this._currentTime);
        console.log("End of day: ", endOfDay);
        this._rangeTime = moment.duration(endOfDay.diff(this._currentTime)).asMinutes();
        console.log("Range time: ", this._rangeTime);
        console.log("Range Height: ", rangeHeight);
        this._offsetRate  =  this._rangeTime / rangeHeight;
        let fiveMinuteMore = moment("May 1 08:00:00", "MMM DD hh:mm:ss").add(5, 'minutes');
        this.props.getZapperContent(this._currentTime.toISOString(true), fiveMinuteMore.toISOString(true));
    };


    _imageUri(item) {
        let image = 'https://static.telus.com/common/cms/images/tv/optik/channel-logos/79/OMNI-Pacific.gif'
        //get first Image
        if (item !== undefined) {
            image = getImageFromArray(item.videoData.originalImages, "logo", "feature");
        }
        return image;
    }

    _zapChannel = (item) => {
        let currentTime = moment();
        let showTime = moment(item.startTime);
        if (showTime.isAfter(currentTime)){
            this._showRecordModal(item)
        } else {
            NativeModules.STBManager.setZapWithJsonString(JSON.stringify({lCN:item.channelData.lCN}),(error, events) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(JSON.parse(events[0]))
                }
            })
        }

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
        console.log("Current Offset", position);
        let periodRate = Math.round((position - 70) * this._offsetRate);
        console.log("Offset Rate", this._offsetRate);
        console.log("Period Rate", periodRate);
        this._timeAtMove = moment("May 1 08:00:00", "MMM DD hh:mm:ss").add(periodRate, 'minutes');
        let time = '';
        if (moment.duration(this._timeAtMove.diff(this._currentTime)).asMinutes() === 0) {
            time = "Now";
        } else {
            time = "Today " + this._timeAtMove.format("HH:mm");
        }
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
            onPress={()=>this._zapChannel(item.item)}>
            <ZapperCell image={this._imageUri(item.item)} style={{width: '100%', height: '100%'}}/>
        </TouchableOpacity>
    );
    _renderListFooter = () => (
        <View style={{width: '100%', height: Dimensions.get("window").height*0.08 + 50, backgroundColor:'transparent'}}/>
    )

    _renderEPGList() {
        const {content} = this.props;
        if ( content.isFetching) {
            return (
                <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
                    <ActivityIndicator size="large" color={colors.whitePrimary}/>
                </View>
            );
        }

        if (!content.data || content.data.length === 0) {
            return (
                <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
                    <Text style={styles.errorMessage}>No programs found at this time</Text>
                </View>
            )
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

    _showRecordModal = (item) => {
        this.setState({
          currentEpg: item,
          recordModalVisibility: true
        })
    }

    _dismissRecordModal = () => {
        this.setState({
          recordModalVisibility: false
        })
    }

    _onBookPress = (liveItem) => {
      let durationInSeconds = Math.round((new Date(liveItem.endTime).getTime() - new Date(liveItem.startTime).getTime()) / 1000)


      let jsonString = {
        "record": {
          "startTime" : this._simpleDataFormat(liveItem.startTime),
          "recordMode" : 1,
          "recordName" : liveItem.videoData.title,
          "lCN" : liveItem.channelData.lcn,
          "duration" : durationInSeconds

        },
        "metaData": {
          "endtime": liveItem.endTime,
          "starttime": liveItem.startTime,
          "title": liveItem.videoData.title,
          "image": getImageFromArray(liveItem.videoData.originalImages, "landscape", "feature"),
          "subTitle": liveItem.videoData.genresData.length > 0 ? liveItem.videoData.genresData[0].name : ""
        }
      }

      console.log('JSON String for record')
      console.log(JSON.stringify(jsonString))

      NativeModules.STBManager.isConnect((connectStr) => {
          let isConnected = JSON.parse(connectStr).is_connected
          if (isConnected) {
              NativeModules.STBManager.addPvrBooKListWithJson(JSON.stringify(json), (error, events) => {
                if (JSON.parse(events[0]) === '1') {
                  if (!this.alertModal.state.isShow) {
                    this.alertModal.setState({isShow: true, message: "Book successfully"})
                  }
                }
                else {
                  if (!this.alertModal.state.isShow) {
                    this.alertModal.setState({isShow: true, message: "Book failure"})
                  }
                }
              })

          }
      })
    }

    _renderRecordModal = () => {
        const {currentEpg} = this.state
        let epgItem = currentEpg

        let iconUrl = ''
        let title = 'No data available'
        if (epgItem !== undefined) {
            iconUrl = getImageFromArray(epgItem.originalImages, "landscape", "feature");
            if (epgItem.videoData && epgItem.videoData.title) {
                title = epgItem.videoData.title
            }
        }

        return (
          <Modal animationType={'fade'} transparent={true} visible={this.state.recordModalVisibility} onRequestClose={() => console.log('Close')}>
              <View style={styles.modal}>
                    <BlurView blurRadius={getBlurRadius(30)} style={styles.modalBlurView} overlayColor={1}/>
                    <TouchableOpacity style={styles.close} onPress={() => this._dismissRecordModal()}>
                      <Image source={require('../../../assets/ic_modal_close.png')} />
                    </TouchableOpacity>
                    <View style={styles.modalInsideContainer}>
                      <Image source={iconUrl === '' ? require('../../../assets/ic_on_stb.png') : {uri: iconUrl}} style={styles.modalImage}/>
                      <Text style={styles.modalTitleText}>{title}</Text>
                      <Text style={styles.introductionText}>Do you want to record this program?</Text>
                      <View style={{width: '60%', flexDirection: 'row', justifyContent: 'space-between', margin: 50}}>
                          <TouchableOpacity style={styles.yesNoButtonContainer} onPress={() => this._onBookPress(epgItem)}>
                              <Text style={{fontSize: 15, color: 'black'}}>
                                  Yes
                              </Text>
                          </TouchableOpacity>
                            <TouchableOpacity style={styles.yesNoButtonContainer} onPress={() => this._dismissRecordModal()}>
                              <Text style={{fontSize: 15, color: 'black'}}>
                                No
                              </Text>
                            </TouchableOpacity>
                      </View>
                    </View>
              </View>
          </Modal>
        )
    }

    render() {

        return (
            <View style={styles.root}>
              <AlertModal ref={(modal) => {
                this.alertVC = modal
              }}/>
               {this._renderRecordModal()}
                <StatusBar
                    translucent={true}
                    backgroundColor='#00000000'
                    barStyle='light-content' />
                <Animated.View
                    {...this._panResponder.panHandlers}
                    style={this.getMovableStyle()}
                    ref={(ref) => this._movable = ref} >
                    <PinkRoundedLabel containerStyle={{zIndex: 1, marginLeft: 5}} text={this.state.time}/>
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
    },
    errorMessage: {
        color: colors.whiteBackground,
        fontSize: 20,
        width: '100%',
        textAlign: 'center'
    },
    modal: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'transparent',
      alignItems: 'center',
      width: '100%',
      height: '100%'
    },
    modalBlurView: {
      width: '100%',
      height: '100%'
    },
  modalInsideContainer: {
    position: 'absolute',
    width: '75%',
    backgroundColor: colors.whitePrimary,
    top: '20.5%',
    left: '12.5%',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 13
  },
  modalImage: {
    marginTop: 50,
    width: 156,
    height: 74,
    alignSelf: 'center',
    borderRadius: 4
  },
  modalTitleText: {
    marginTop: 15,
    fontSize: 15,
    color: 'black',
    textAlign: 'center'
  },
  modalShortDes: {
    fontSize: 12,
    color: colors.greyParentalControl,
    textAlign: 'center',
    marginTop: 4
  },
  modalLongDes: {
    fontSize: 12,
    color: colors.greyParentalControl,
    textAlign: 'center',
    marginTop: 11,
    marginLeft: 37,
    marginRight: 37
  },
  close: {
    position: 'absolute',
    top: 6 + rootViewTopPadding(),
    right: 20
  },
  introductionText: {
    marginTop: 20,
    fontSize: 15,
    color: 'black'
  },
  yesNoButtonContainer: {
    padding: 5
  }

});
