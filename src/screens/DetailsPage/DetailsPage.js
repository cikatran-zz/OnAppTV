import React, {PureComponent} from 'react'
import {
    Dimensions,
    FlatList,
    Image, Linking, Modal, NativeModules,
    Platform,
    SectionList, Share,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    InteractionManager
} from 'react-native'
import {colors} from '../../utils/themeConfig'
import PinkRoundedLabel from '../../components/PinkRoundedLabel'
import {secondFormatter, timeFormatter} from '../../utils/timeUtils'
import {rootViewTopPadding} from "../../utils/rootViewPadding";
import {getChannel, getWatchingHistory} from "../../api";
import Orientation from "react-native-orientation";
import AlertModal from "../../components/AlertModal";
import {getImageFromArray} from "../../utils/images";
import { DotsLoader } from 'react-native-indicator'

export default class DetailsPage extends React.Component {

    constructor(props) {
        super(props);
    }

    _keyExtractor = (item, index) => index;

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            const {item, isLive} = this.props.navigation.state.params;

            if (item && isLive !== undefined) {
                if (isLive === true && item.channelData
                    && item.channelData.serviceId
                    && item.channelId) {
                    /*
                      Fetching information about EPG next in channel and EPG which are
                      at the same time on other channels
                       */
                    this.props.getEpgs([item.channelData.serviceId])
                    this.props.getEpgSameTime(new Date(), item.channelId)
                }
                else if (item.type) {
                    /*
                    Fetch epg with related content or epg in series
                     */
                    if (item.type === 'Episode')
                        this.props.getEpgWithSeriesId([item.seriesId])
                    else
                        this.props.getEpgWithGenre(item.genreIds)
                }
            }
        })

        Orientation.lockToPortrait();
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content');
            (Platform.OS != 'ios') && StatusBar.setBackgroundColor('#ffffff');
            Orientation.lockToPortrait();
        });
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    render() {
        // EPGs is EPG array, video is an EPG or videoModel depend on videoType
        const {epg, epgSameTime} = this.props;
        const {item, isLive} = this.props.navigation.state.params

        if ((isLive && !item) || (!epg || !epg.data || !item) || (this._isOldData(epg.data, isLive))) {
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <DotsLoader color={colors.textGrey} size={20} betweenSpace={10}/>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <StatusBar
                    translucent={true}
                    backgroundColor='#ffffff'
                    barStyle='dark-content'/>
                <AlertModal ref={(modal) => { this.alertVC = modal }}/>
                <SectionList
                    style={styles.container}
                    keyExtractor={this._keyExtractor}
                    stickySectionHeadersEnabled={false}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    sections={[
                        {data: [item], showHeader: false, renderItem: this._renderBanner},
                        {data: [item], renderItem: this._renderBannerInfo},
                        {data: [epg.data], showHeader: false, renderItem: this._renderList},
                        {data: [epgSameTime.data], showHeader: false, renderItem: this._renderListEpgInSameTime}
                    ]}
                />
            </View>
        )
    }

    _renderBanner = ({item}) => {
        let data = this._isFromChannel() ? item.videoData : item
        let url = '';
        if (data.originalImages != null && data.originalImages.length > 0) {
            url = data.originalImages[0].url ? data.originalImages[0].url : '';
        }
        return (
            <View style={styles.topContainer}>
                <TouchableOpacity style={{padding: 15,
                                            alignSelf: 'flex-start'}}
                                  onPress={() => this.props.navigation.goBack()}>
                    <Image source={require('../../assets/ic_back_details.png')}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bannerThumbnailContainer}
                                  onPress={() => this._onPress(item)}>
                    <Image source={{uri: url}}
                           style={styles.banner}/>
                </TouchableOpacity>
                <TouchableOpacity style={{position: 'absolute',
                                            bottom: 6,
                                            left: 21}}>
                    <Image source={require('../../assets/ic_change_orientation.png')}/>
                </TouchableOpacity>
            </View>
        )
    };

    _renderBannerInfo = ({item}) => {
        let data = this._isFromChannel() ? item.videoData : item

        return (
            <View style={styles.bannerContainer}>
                <View style={styles.bannerInfoContainer}>
                    <View style={styles.bannerInfo}>
                        <Text style={styles.videoTitleText}
                              numberOfLines={1}
                              ellipsizeMode={'tail'}>
                            {data.title}
                         </Text>
                        <Text style={styles.videoTypeText}>{data.type}</Text>
                    </View>
                    <View style={styles.bannerButtonsContainer}>
                        <TouchableOpacity onPress={()=> {this.alertVC.setState({isShow: true, message: "Coming soon"})}}>
                            <Image source={require('../../assets/lowerpage_record.png')}
                                   style={styles.videoPlayButton}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=> {this.alertVC.setState({isShow: true, message: "Coming soon"})}}>
                            <Image source={require('../../assets/lowerpage_heart.png')}
                                   style={styles.videoLoveButton}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=> this._shareExecution(item.title, '')}>
                            <Image source={require('../../assets/share.png')}
                                   style={styles.videoShareButton}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.videoDescriptionContainer}>
                    <Text style={styles.videoDescription}>{data.longDescription}</Text>
                </View>
            </View>
        )
    }

    _renderPinkIndicatorButton = () => {
        const {item} = this.props.navigation.state.params

        if (this._isFromChannel()) {
            // isLive
            return (<PinkRoundedLabel style={{marginBottom: 21}} text={"NEXT CHANNEL"}/>)
        }

        switch (item.type) {
            case 'Episode': {
                let seasonIndex = item.seasonIndex ? item.seasonIndex : ''
                return (<PinkRoundedLabel style={{marginBottom: 21}} text={"SEASON " + seasonIndex}/>)
            }
            case 'Standalone':
                return (<PinkRoundedLabel style={{marginBottom: 21}} text={"RELATED"}/>)
            default:
                return (<PinkRoundedLabel style={{marginBottom: 21}} text={"NEXT"}/>)
        }
    }

    _renderLogoChannel = (urlArray) => {
        let logoUrl;
        if (urlArray && urlArray.length > 0) logoUrl = {uri: urlArray[0].url}
        if (this._isFromChannel() && logoUrl) {
            return (<Image source={logoUrl}/>)
        }
    }

    _renderNextInChannelItem = ({item}) => {
        let data = item.videoData;
        let url = getImageFromArray(data.originalImages, 'landscape', 'feature');
        return (
            <View style={{flexDirection: 'column',
                            marginLeft: 8,
                            alignSelf: 'flex-start',
                            alignItems: 'center'}}>
                <View style={styles.nextInChannelContainer}>
                    <Image source={{uri: url}}
                           style={{width: '100%',
                                  height: '100%'}}/>
                </View>
                <Text numberOfLines={1}
                      ellipsizeMode={'tail'}
                      style={styles.nextInChannelItemText}>
                    {item.videoData.title}
                </Text>
            </View>
        )
    }

    _renderListNextInChannel = (item) => {
        if (!item || item.length === 0) return null
        return (
            <View>
                <View style={styles.listHeader}>
                    <View style={styles.nextButtonContainer}>
                        <PinkRoundedLabel text={"NEXT"}/>
                    </View>
                </View>
                <FlatList
                    horizontal={true}
                    data={item}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderNextInChannelItem}
                />
            </View>
        )
    }

    _renderListApps = (item) => {

    }

    _renderListEpgInSameTime = ({item}) => {
        if (!item || item.length === 0) return null
        return (
            <View>
                <View style={styles.listHeader}>
                    <View style={styles.nextButtonContainer}>
                        {this._renderPinkIndicatorButton()}
                    </View>
                </View>
                <FlatList
                    style={styles.list}
                    horizontal={false}
                    data={item}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderListVideoItem}/>
            </View>
        )
    }


    _renderList = ({item}) => {
        if (this._isFromChannel()) {
            return (
                <View>{this._renderListNextInChannel(item)}</View>
            )
        }
        else {
            return (
                <View style={{marginBottom: 36}}>
                    <View style={styles.listHeader}>
                        <View style={styles.nextButtonContainer}>
                            {this._renderPinkIndicatorButton()}
                        </View>
                    </View>
                    <FlatList
                        style={styles.list}
                        horizontal={false}
                        data={item}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderListVideoItem}/>
                </View>
            )
        }
    }

    _renderListVideoItem = ({item}) => {
        let videoData = this._isFromChannel() ? item.videoData : item

        if (videoData) {
            return (
                <View style={styles.itemContainer}>
                    <TouchableOpacity
                        style={styles.videoThumbnailContainer}
                        onPress={() => this._onPress(item)}>
                        <Image
                            style={styles.videoThumbnail}
                            source={{uri: getImageFromArray(videoData.originalImages, 'landscape', 'feature')}}/>
                    </TouchableOpacity>
                    <View style={styles.itemInformationContainer}>
                        <Text style={styles.itemTitle}
                              numberOfLines={1}
                              ellipsizeMode={'tail'}>
                            {videoData.title}
                        </Text>
                        <Text style={styles.itemType}>{videoData.type}</Text>
                        <Text
                            style={styles.itemTime}>{this._isFromChannel() ? timeFormatter(item.startTime) + ' - ' + timeFormatter(item.endTime) : secondFormatter(item.durationInSeconds)}</Text>
                    </View>
                    <View style={styles.itemActionsContainer}>
                        <TouchableOpacity onPress={() => {
                            this.alertVC.setState({isShow: true, message: "Comming soon"})
                        }}>
                            <Image source={require('../../assets/lowerpage_record.png')} style={styles.itemPlayButton}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.alertVC.setState({isShow: true, message: "Comming soon"})
                        }}>
                            <Image source={require('../../assets/lowerpage_heart.png')} style={styles.itemLoveButton}/>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        else return null
    }

    _onPress = (item) => {
        const {isLive} = this.props.navigation.state.params;
        const {epg, navigation} = this.props;


        if (Platform.OS !== 'ios') {
            let data = epg.data.length !== 0 ? epg.data : [item]
            let itemIndex = data.findIndex(x => x.title ? x.title === item.title && x.durationInSeconds === item.durationInSeconds : x.channelData.lcn === item.channelData.lcn)
            console.log('Special', data);
            NativeModules.RNControlPageNavigation
                .navigateControl(data,
                    itemIndex,
                    isLive,
                    () => { console.log("onDismiss") },
                    () => { console.log("onDetail") });
        }
        else {
            navigation.replace('VideoControlModal', {
                item: item,
                epg: epg.data.length !== 0 ? epg.data : [item],
                isLive: isLive
            })
        }
    }

    _onScroll(e) {
        this.props.listScrollOffsetY(e.nativeEvent.contentOffset.y)
    }

    _isFromChannel = () => this.props.navigation.state.params.isLive === true

    _isOldData = (list, isLive) => {
        if (isLive === true) {
            // EPG should have channelId
            if (list.length > 0) {
                return !list.some(x => x.channelId)
            }
            else return false
        }
        else {
            // EPG should have contentId
            if (list.length > 0) {
                return !list.some(x => x.contentId)
            }
            else return false
        }
    };

    _renderAppSection = (image, title, description, url) => {
        return (
            <View style={{flexDirection: 'column', marginHorizontal: 15, marginBottom: 36, alignItems: 'flex-start'}}>
                <PinkRoundedLabel style={{marginBottom: 21}} text={"APP'S"}/>
                <View style={styles.appSectionView}>
                    <Image source={{uri: (image == null) ? 'https://i.imgur.com/7eKo6Q7.png' : image}} style={styles.appImage}/>
                    <View style={styles.appTextView}>
                        <Text style={styles.videoTitleText}>{title}</Text>
                        <Text style={styles.videoDescription}>{description}</Text>
                    </View>
                    <TouchableOpacity onPress={()=> Linking.openURL(url)} style={{marginRight: 0, marginLeft: 'auto', flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <View style={styles.getButtonView}>
                            <Text style={styles.getButtonText}>GET</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    };

    // APPS
    _renderApps = ({item}) => {
        if (Platform.OS === "ios") {
            if (item.app_ios_url === "" || item.app_ios_url === null) {
                return null
            } else {
                return this._renderAppSection(item.app_ios_image, item.app_ios_name, item.app_ios_description, item.app_ios_url);
            }
        } else {
            if (item.app_android_url === "" || item.app_android_url === null) {
                return null
            } else {
                return this._renderAppSection(item.app_android_image, item.app_android_name, item.app_android_description, item.app_android_url);
            }
        }

    };

    _shareExecution = (title, url) => {
        let content = {
            message: "",
            title: title,
            url: url
        };
        Share.share(content, {})
    };

}
const {w, h} = Dimensions.get("window")
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        height: h,
        backgroundColor: colors.whitePrimary
    },
    topContainer: {
        flexDirection: 'column',
        width: '100%',
        marginBottom: 21,
        marginTop: rootViewTopPadding(),
        alignItems: 'center'
    },
    bannerThumbnailContainer: {
        height: 164,
        paddingHorizontal: 15,
        width: '100%',
        backgroundColor: colors.whitePrimary,
    },
    list: {
        width: '100%',
        paddingBottom: 90
    },
    itemContainer: {
        flexDirection: 'row',
        paddingTop: 9,
        paddingBottom: 9,
        paddingLeft: 14,
        paddingRight: 14,
        width: '100%',
        height: 100,
    },
    videoThumbnailContainer: {
        width: 156,
        height: 74,
        borderRadius: (Platform.OS === 'ios') ? 4 : 8
    },
    videoThumbnail: {
        width: '100%',
        height: '100%',
        borderRadius: (Platform.OS === 'ios') ? 4 : 8
    },
    itemInformationContainer: {
        flexDirection: 'column',
        width: '50%',
    },
    itemActionsContainer: {
        flexDirection: 'column',
        flex: 1,
        alignItems: 'flex-end',
        width: 18,
    },
    itemTitle: {
        marginTop: 12,
        marginLeft: 12,
        color: colors.textMainBlack,
        fontWeight: 'bold',
        fontSize: 15
    },
    itemType: {
        marginTop: 2,
        marginLeft: 13,
        color: '#ACACAC',
        fontSize: 12
    },
    itemTime: {
        marginTop: 1,
        marginLeft: 13,
        color: '#ACACAC',
        fontSize: 12
    },
    itemPlayButton: {
        marginTop: 14,
        width: 17,
        height: 17
    },
    itemLoveButton: {
        resizeMode: 'contain',
        marginTop: 12,
        width: 17,
        height: 17
    },
    videoPlayButton: {
        width: 17,
        height: 17,
        marginRight: 18,
    },
    videoLoveButton: {
        resizeMode: 'contain',
        width: 17,
        height: 17,
        marginRight: 18
    },
    videoShareButton: {
        resizeMode: 'contain',
        width: 17,
        height: 17,
        marginRight: 3
    },
    banner: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.whitePrimary,
        borderRadius: (Platform.OS === 'ios') ? 4 : 8,
        overflow: 'hidden'
    },
    bannerContainer: {
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 21
    },
    bannerInfoContainer: {
        width: '90%',
        height: 35,
        flexDirection: 'row'
    },
    bannerInfo: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'flex-start'
    },
    bannerButtonsContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    videoTitleText: {
        fontSize: 16,
        color: colors.textMainBlack
    },
    videoTypeText: {
        fontSize: 12,
        color: '#383838'
    },
    videoDescriptionContainer: {
        width: '90%',
        marginTop: 20,
        maxHeight: 162,
        flexDirection: 'column',
    },
    videoDescription: {
        fontSize: 12,
        color: '#ACACAC'
    },
    nextButtonContainer: {
        marginLeft: 14,
        justifyContent: 'flex-start'
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexDirection: 'column',
        marginRight: 14
    },
    listHeader: {
        width: '100%',
        flexDirection: 'row'
    },
    nextInChannelContainer: {
        borderRadius: 4,
        borderWidth: 2,
        overflow: 'hidden',
        borderColor: "#95989A",
        width: 150,
        height: 75,
        marginVertical: 5,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    nextInChannelItemText: {
        marginTop: 18,
        color: colors.textMainBlack,
        fontSize: 15
    },
    appSectionView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    appImage: {
        width: 87.4,
        height: 87.4,
        borderRadius: 22,
        resizeMode: 'cover'
    },
    appTextView: {
        marginLeft: 17,
        marginRight: 17,
        flexDirection: 'column'
    },
    getButtonText: {
        fontSize: 11,
        color: '#4E4E4E'
    },
    getButtonView: {
        width: 57,
        height: 26,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        overflow: 'hidden',
        borderColor: 'rgba(78,78,78,0.3)',
        borderWidth:1
    }
})

const fakeBannerData = {
    url: 'https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'
}


