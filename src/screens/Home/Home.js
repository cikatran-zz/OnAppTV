/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    View,
    SectionList,
    ImageBackground,
    Platform,
    Dimensions,
    NativeModules,
    TouchableOpacity,
    StatusBar,
    Linking,
    InteractionManager,
    DeviceEventEmitter,
    ActivityIndicator, NativeEventEmitter
} from 'react-native';
import PinkRoundedLabel from '../../components/PinkRoundedLabel';
import VideoThumbnail from '../../components/VideoThumbnail'
import BlurView from '../../components/BlurView'
import {
    colors, textDarkDefault, textLightDefault, borderedImageDefault
} from '../../utils/themeConfig';
import {getBlurRadius} from '../../utils/blurRadius'
import {secondFormatter, timeFormatter} from "../../utils/timeUtils";
import Orientation from 'react-native-orientation';
import _ from 'lodash';
import {getChannel, getWatchingHistory} from "../../api";
import AlertModal from "../../components/AlertModal";
import {DotsLoader} from "react-native-indicator";
import {getImageFromArray} from "../../utils/images";
import moment from 'moment';

const { RNConnectionViewModule } = NativeModules;
const connectionViewEmitter = new NativeEventEmitter(RNConnectionViewModule);


export default class Home extends Component {
    _livePage = 1;
    _vodPage = 1;
    constructor(props) {
        super(props);
        this.alertVC = null;

        this.subscription = connectionViewEmitter.addListener('RefreshConnection', (event)=> {
            console.log("Refresh");
            this.fetchData()
        });
        this.state = {};
    };

    componentWillMount() {
        Orientation.lockToPortrait();
    }

    componentWillReceiveProps(nextProps) {
        const {epgZap} = nextProps;
        if (epgZap.disableTouch === true && epgZap.screen === 0 && epgZap.isFetching === false && epgZap.data != null && epgZap.data.length != 0) {
            this._navigateToControlPage(epgZap.data);
        }
    }

    _navigateToControlPage = (array) => {
        const {navigation} = this.props;
        const {zapIndex} = this.state;
        if (zapIndex !== undefined) {
            setTimeout(() => {
                this.props.disableTouch(false, 0);
                this.setState({
                    zapIndex: zapIndex
                })
                }, 100);
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
        }
    };

    fetchData() {
        InteractionManager.runAfterInteractions(() => {
            this.props.getBanner();
            this.props.getAds();
            this.props.getLive(true, 1, 20);
            this.props.getVOD(1, 10);
            this.props.getCategory();
            this.props.getNews();
            this.props.getWatchingHistory();
            this.props.getChannel();
            this.props.getPlaylist("VIDEOS FOR YOU");
            this.props.getPlaylist("POPULAR LIVE");
            this.props.getPlaylist("LIVE FOR YOU");
            this.props.getPlaylist("POPULAR SERIES");
            this.props.getPlaylist("SERIES FOR YOU");
            this.props.getPlaylist("POPULAR VIDEOS");
            this.props.getLiveEpgInZapper(true, []);
        })
    }

    componentDidMount() {
        this.fetchData();
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('light-content');
            (Platform.OS != 'ios') && StatusBar.setBackgroundColor('transparent');
            this.props.getChannel();
            Orientation.lockToPortrait();
        });
        DeviceEventEmitter.addListener('bannerDetailsPage', (e) => {
            const {item, isLive} = e;
            this._onVideoPress(JSON.parse(item), isLive);
        });
    };

    componentWillUnmount() {
        this._navListener.remove();
    }

    // CHANNEL
    _navigateToZappers = () => {
        this.props.navigation.navigate('Zappers');
    };

    _renderChannelListItem = ({item}) => {
        console.log('Rerender', this.props.epgZap.disableTouch);
        if (item == null) {
            return (
                <TouchableOpacity onPress={() => this._navigateToZappers()}>
                    <View style={[styles.itemContainer, {borderWidth: 1, borderColor: 'rgba(149,152,154,32)'}]}>
                        <Text style={styles.channelText}>{'SELECT \n' + 'YOUR \n' + 'FAVORITE \n' + 'CHANNELS'}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
        let imageUrl = 'http://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder4.png';
        if (item.image != null) {
            imageUrl = item.image;
        }
        return (
            <TouchableOpacity style={{padding: 0}} onPress={() => this._onChannelPress(item)} disabled={this.props.epgZap.disableTouch == null ? false : this.props.epgZap.disableTouch}>
                <View style={styles.itemContainer}>
                    <Image
                        style={styles.itemImage}
                        resizeMode={'cover'}
                        source={{uri: imageUrl}}/>
                </View>
            </TouchableOpacity>
        )
    };

    _onChannelPress = (item) => {
        const {channel} = this.props;
        this.props.disableTouch(true, 0);
        this.setState({
            zapIndex: channel.favoriteChannels != null ? channel.favoriteChannels.findIndex(x => x.serviceID === item.serviceID) : 0
        })
        this.props.getLiveEpgInZapper(true, channel.favoriteChannels.map(x => x.serviceID));
        NativeModules.STBManager.isConnect((connectString) => {
            let connected = JSON.parse(connectString).is_connected;
            if (connected) {
                NativeModules.STBManager.setZapWithJsonString(JSON.stringify({lCN: item.lCN}), (error, events) => {

                });
            }
        });
    };

    _renderChannelListItemSeparator = () => (
        <View style={styles.itemContainerSeparator}/>
    );

    _renderChannelList = ({item}) => {
        let data = item;
        if (_.isEmpty(data)) {
            data = [null];
        }
        return (
            <FlatList
                style={styles.listHorizontal}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={this._renderChannelListItemSeparator}
                data={data}
                keyExtractor={this._keyExtractor}
                extraData={this.state}
                renderItem={this._renderChannelListItem}/>
        )
    };

    _keyExtractor = (item, index) => index.toString();

    // BANNER
    _renderBanner = ({item}) => {
        if (item == null) {
            return null
        }
        return (
            <TouchableOpacity onPress={() => this._onBannerPress(item, false)}>
                <View style={styles.slotMachineContainer}>
                    <ImageBackground
                        style={styles.slotMachineImage}
                        source={{uri: getImageFromArray(item.originalImages, 'portrait', 'landscape')}}>
                        <View style={[styles.slotMachineImage, {backgroundColor: '#1C1C1C', opacity: 0.36}]}/>
                        <View style={styles.bannerinfo}>
                            <PinkRoundedLabel text="NEW MOVIE" containerStyle={{alignSelf: 'flex-end', marginBottom: 14}}/>
                            <Text style={styles.bannerTitle}>
                                {item.title}
                            </Text>
                            <Text style={styles.bannerSubtitle}>
                                {item.shortDescription}
                            </Text>
                        </View>
                    </ImageBackground>
                </View>
            </TouchableOpacity>
        )
    };

    // ADS
    _renderAds = ({item}) => {
        if (item.isFetching) {
            return (
                <View
                    style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <DotsLoader color={colors.textGrey} size={10} betweenSpace={10}/>
                </View>
            )
        }
        if (item.data === null) {
            return (
                <View
                    style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text style={styles.errorMessage}>Can't load image</Text>
                </View>
            );
        }

        let url = item.data.url ? item.data.url : 'https://www.hi-global.tv';
        return (
            <TouchableOpacity onPress={() => Linking.openURL(url)} style={{marginBottom: 36}}>
                <View style={[styles.placeHolder,{bottom: 0}]}>
                    <Text style={styles.textPlaceHolder}>On App TV</Text>
                </View>
                <ImageBackground
                    style={styles.adsContainer}
                    source={{uri: getImageFromArray(item.data.originalImages, 'logo', 'landscape')}}>
                    <View style={styles.adsLabelContainer}>
                        <PinkRoundedLabel text={item.data.deal} style={{fontSize: 10, color: colors.whitePrimary}}/>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        )
    };

    _renderFooter = ({item}) => {
        if (item.isFetching) {
            return (
                <View
                    style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <DotsLoader color={colors.textGrey} size={20} betweenSpace={10}/>
                </View>
            )
        }

        if (item.data === null) {
            return (
                <View
                    style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <Text style={styles.errorMessage}>Can't load image</Text>
                </View>
            );
        }

        let imageUrl = getImageFromArray(item.data.originalImages, 'landscape', 'feature');
        return (
            <TouchableOpacity onPress={()=> Linking.openURL(item.data.url)}
                                style={{width: '100%',
                                        alignSelf: 'center'}}>
                <View style={styles.notificationContainer}>
                    <View style={styles.placeHolder}>
                        <Text style={styles.textPlaceHolder}>On App TV</Text>
                    </View>
                    <Image style={styles.notificationImage} source={{uri: imageUrl}}/>
                    <Text style={styles.notificationTitle}>{item.data.title}</Text>
                    <Text style={styles.notificationSubTitle}>{item.data.shortDescription}</Text>
                </View>
            </TouchableOpacity>
        )
    };

    // ON LIVE
    _renderOnLiveItem = ({item}) => {
        if (item.epgsData[0] == null) {
            return null;
        }
        let genres = "";
        if (item.epgsData[0].videoData.genres != null && item.epgsData[0].videoData.genres.length > 0) {
            item.epgsData[0].videoData.genres.forEach((genre, index) => {
                if (genres.length != 0) {
                    genres = genres.concat(", ");
                }
                genres = genres.concat(genre.name.toString());
            })
        } else {
            genres = "N/A";
        }
        let timeInfo = timeFormatter(item.epgsData[0].startTime) + '-' + timeFormatter(item.epgsData[0].endTime);

        let currentDate = (new Date()).getTime();
        let startDate = (new Date(item.epgsData[0].startTime)).getTime();
        let endDate = (new Date(item.epgsData[0].endTime)).getTime();
        let progress = (currentDate - startDate) / (endDate - startDate) * 100;
        return (
            <TouchableOpacity style={styles.liveThumbnailContainer} onPress={() => this._onVideoPress(item.epgsData[0], true)}>
                <VideoThumbnail style={styles.videoThumbnail} showProgress={true} progress={progress + "%"} imageUrl={getImageFromArray(item.epgsData[0].videoData.originalImages, 'landscape', 'feature')}/>
                <Text numberOfLines={1} style={styles.textLiveVideoTitle}>{item.epgsData[0].videoData.title}</Text>
                <Text numberOfLines={1} style={styles.textLiveVideoInfo}>{genres}</Text>
                <Text numberOfLines={1}
                      style={styles.textLiveVideoInfo}>{item ? item.title : "No Title"}</Text>
                <Text numberOfLines={1} style={styles.textLiveVideoInfo}>{timeInfo}</Text>
            </TouchableOpacity>
        )
    };

    _fetchMoreLive = () => {
        if (this.props.live.data != null) {
            if (this.props.live.data.length === this.currentPage * 20) {
                this._livePage++;
                this.props.getLive(true, this._livePage, 20);
            }
        }
    }

    _fetchMoreVOD = () => {

        if (this.props.vod.data != null) {
            if (this.props.vod.data.length === this.currentPage * 10) {
                this._vodPage++;
                this.props.getVOD(this._vodPage, 10);
            }
        }

    }

    _renderOnLiveList = ({item}) => {
        if (item == null) {
            return (
                <View style={{flex: 1}}>
                    <Text style={styles.noInternetConnection}>No data found. Please check the internet connection</Text>
                </View>
            )
        }
        return (<FlatList
            style={{flex: 1, marginBottom: 21, marginLeft: 7, marginRight: 8}}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={item}
            onEndReachedThreshold={5}
            ListFooterComponent={this._renderLiveFooter}
            onEndReached={this._fetchMoreLive}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderOnLiveItem}/>)
    };

    _onVideoPress = (item, isLive) => {
        const {navigation} = this.props;
        navigation.navigate('DetailsPage', {
            item: item,
            isLive: isLive
        })
    };

    _onBannerPress = (item) => {
        const {navigation} = this.props;
        if (Platform.OS !== 'ios') {
            NativeModules.RNControlPageNavigation
                .navigateControl([item],
                    0,
                    false,
                    true,
                    false,
                    () => { console.log("onDismiss") },
                    () => { console.log("onDetail") });
        }
        else {
            navigation.navigate('VideoControlModal', {
                item: item,
                epg: [item],
                isLive: false
            })
        }

    };

    // ON VOD
    _renderVODItem = ({item}) => {

        let genres = "";
        if (item.genresData != null && item.genresData.length > 0) {
            item.genresData.forEach((genre, index) => {
                if (genres.length != 0) {
                    genres = genres.concat(", ");
                }
                genres = genres.concat(genre.name.toString());
            })
        } else {
            genres = "N/A";
        }

        return (
            <TouchableOpacity style={styles.liveThumbnailContainer} onPress={() => this._onVideoPress(item, false)}>
                <VideoThumbnail style={styles.videoThumbnail} showProgress={false} imageUrl={getImageFromArray(item.originalImages, 'landscape', 'feature')}/>
                <Text numberOfLines={1} style={styles.textLiveVideoTitle}>{item.title ? item.title : "No Title"}</Text>
                <Text numberOfLines={1} style={styles.textLiveVideoInfo}>{genres}</Text>
                <Text numberOfLines={1}
                      style={styles.textLiveVideoInfo}>{secondFormatter(item.durationInSeconds)}</Text>
            </TouchableOpacity>)
    };
    _renderVODFooter = () => {
        const {vod} = this.props;
        if (vod.isFetching) {
            return (
                <View
                    style={{height: 74, width: 100 ,justifyContent:'center', alignItems:'center'}}>
                    <ActivityIndicator size={"small"} color={colors.textGrey}/>
                </View>
            )
        } else {
            return null;
        }
    }

    _renderLiveFooter = () => {
        const {live} = this.props;
        if (live.isFetching) {
            return (
                <View
                    style={{height: 74, width: 100 ,justifyContent:'center', alignItems:'center'}}>
                    <ActivityIndicator size={"small"} color={colors.textGrey}/>
                </View>
            )
        } else {
            return null;
        }
    }


    _renderVODList = ({item}) => {
        if (item == null || item[0] == null) {
            return (
                <View style={{flex: 1}}>
                    <Text style={styles.noInternetConnection}>No data found. Please check the internet connection</Text>
                </View>
            )
        }
        return (
            <FlatList
                style={{marginBottom: 21, marginLeft: 7, marginRight: 8}}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={item}
                onEndReachedThreshold={0.5}
                ListFooterComponent={this._renderVODFooter}
                onEndReached={this._fetchMoreVOD}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderVODItem}/>
        )
    }

    _renderPlaylist = ({item}) => {
        if (item == null || item[0] == null) {
            return (
                <View style={{flex: 1}}>
                    <Text style={styles.noInternetConnection}>No data found. Please check the internet connection</Text>
                </View>
            )
        }
        return (
            <FlatList
                style={{marginBottom: 21, marginLeft: 7, marginRight: 8}}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={item}
                onEndReachedThreshold={0.5}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderPlaylistItem}/>
        )
    }

    _renderPlaylistItem = ({item}) => {

        return (
            <TouchableOpacity style={styles.liveThumbnailContainer} onPress={() => this._onVideoPress(item, false)}>
                <VideoThumbnail style={styles.videoThumbnail} showProgress={false} imageUrl={getImageFromArray(item.originalImages, 'landscape', 'feature')}/>
                <Text numberOfLines={1} style={styles.textLiveVideoTitle}>{item.title ? item.title : "No Title"}</Text>
                <Text numberOfLines={1} style={styles.textLiveVideoInfo}>{item.type ? item.type : "N/A"}</Text>
            </TouchableOpacity>)
    };

    // CATEGORY

    _navigateToMyCategories = () => {
        const {navigate} = this.props.navigation;
        navigate('MyCategories', {data: this.props.category.data});
    };

    _navigateToCategory = (cate) => {
        const {navigation, category} = this.props;
        console.log("Home_cat",category);
        let favoriteData = _.slice(category.favorite, 0, category.favorite.length - 1);
        console.log("Home_dat",favoriteData);
        navigation.navigate('Category', {data: favoriteData, fromItem: cate});
    };

    _renderCategoryItem = ({item}) => {

        if (item.name == "_ADD") {

            return (
                <TouchableOpacity onPress={() => this._navigateToMyCategories()}>
                    <View style={[styles.liveThumbnailContainer]}>
                        <View style={styles.addMoreCategoryContainer}>
                            <Text style={styles.textCenter}>ADD</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
        return (
            <TouchableOpacity onPress={() => this._navigateToCategory(item.name)}>
                <View style={styles.liveThumbnailContainer}>
                    <VideoThumbnail style={styles.videoThumbnail} showProgress={false} textCenter={item.name} marginHorizontal={10}/>
                </View>
            </TouchableOpacity>
        )
    };

    _renderCategoryList = ({item}) => {
        return (
            <FlatList
                style={{marginBottom: 36, marginLeft: 7, marginRight: 8}}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={item}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderCategoryItem}/>
        )
    };

    _renderSectionHeader = ({section}) => {
        if (section.showHeader && section.data != null && section.data[0] != null) {
            return (
                <View style={styles.headerSection}>
                    <PinkRoundedLabel text={section.title} style={{fontSize: 10, color: colors.whitePrimary}}/>
                </View>
            )
        } else {
            return null
        }
    };

    //Fix bottom tabbar overlay the List
    _renderListFooter = () => (
        <View style={{
            width: '100%',
            height: Dimensions.get("window").height * 0.08 + 20,
            backgroundColor: 'transparent'
        }}/>
    );

    // ResumeVOD

    _onResumePress = (item) => {
        const {navigation} = this.props;

        navigation.navigate('VideoControlModal', {
            item: item,
            epg: [item],
            isLive: false
        })
    };

    _renderResumeVODItem = ({item}) => {
        if (item == null) {
            return null;
        }
        let genres = '';
        if (item.genres != null && item.genres.length > 0) {
            item.genres.forEach((genre, index) => {
                if (genres.length != 0) {
                    genres = genres.concat(", ");
                }
                genres = genres.concat(genre.name.toString());
            })
        }
        let videoLength = item.durationInSeconds ? item.durationInSeconds : 0;
        let lastPosition = item.stop_position ? item.stop_position : 0;
        let progress = lastPosition / videoLength * 100;
        return (
            <TouchableOpacity style={styles.liveThumbnailContainer} onPress={() => this._onResumePress(item)}>
                <VideoThumbnail style={styles.videoThumbnail} showProgress={true} progress={progress + "%"} imageUrl={getImageFromArray(item.originalImages, 'landscape', 'feature')}/>
                <Text numberOfLines={1} style={styles.textLiveVideoTitle}>{item.title}</Text>
                <Text numberOfLines={1} style={styles.textLiveVideoInfo}>{genres}</Text>
            </TouchableOpacity>
        )
    };


    _renderResumeVODList = ({item}) => {
        if (item == null || item[0] == null) {
            return null;
        }

        return (
            <FlatList
                style={{marginBottom: 21, marginLeft: 7, marginRight: 8}}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={item}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderResumeVODItem}/>
        )
    };

    _addPlaylistSection(playlistTitle, sections) {
        const {playlist} = this.props;
        let playlistMap = playlist.playlistMap.get(playlistTitle);
        let playlistData = [];
        if (playlistMap) {
            if (!_.isEmpty(playlistMap))
                playlistData = playlistMap.playlist;
        }
        if (playlistData !== null && playlistData.length > 0) {
            sections.push({data: [playlistData], title: playlistTitle, showHeader: true, renderItem: this._renderPlaylist});
        }

    }


    render() {
        const {banner, live, vod, ads, category, news, watchingHistory, channel} = this.props;



        let bannerData = (banner.data == null || banner.data.length == 0) ? null : banner.data[0]
        let sections = [
            {data: [bannerData], showHeader: false, renderItem: this._renderBanner},
            {data: [channel.favoriteChannels], showHeader: false, renderItem: this._renderChannelList},
            {data: [watchingHistory.data], showHeader: true,title: "RESUME", renderItem: this._renderResumeVODList},
            {data: [ads], showHeader: false, renderItem: this._renderAds}
            ];

        this._addPlaylistSection("VIDEOS FOR YOU", sections);
        this._addPlaylistSection("POPULAR LIVE", sections);
        this._addPlaylistSection("LIVE FOR YOU", sections);
        this._addPlaylistSection("POPULAR SERIES", sections);
        this._addPlaylistSection("SERIES FOR YOU", sections);
        this._addPlaylistSection("POPULAR VIDEOS", sections);

        if (live.data != null && live.data.length > 0) {
            let epgsDataArray = _.filter(live.data, (item) =>  { return item.epgsData != null && item.epgsData.length > 0});
            if (epgsDataArray.length > 0)
                sections.push({data: [epgsDataArray], title: "ON LIVE", showHeader: true, renderItem: this._renderOnLiveList});
        }

        if (vod.data !== null && vod.data.length > 0) {
            sections.push({data: [vod.data], title: "ON VOD", showHeader: true, renderItem: this._renderVODList});
        }

        sections.push({ data: [category.favorite], title: "BY CATEGORY", showHeader: true, renderItem: this._renderCategoryList});

        sections.push({data: [news], title: "NOTIFICATION", showHeader: true, renderItem: this._renderFooter});

        return (
            <View style={{flex: 1, flexDirection: 'column'}}>
                <StatusBar
                    translucent={true}
                    backgroundColor='#00000000'
                    barStyle='light-content'/>
                <AlertModal ref={(modal) => {
                    this.alertVC = modal
                }}/>
                <SectionList
                    style={{backgroundColor: colors.whitePrimary, position: 'relative', flex: 1}}
                    keyExtractor={this._keyExtractor}
                    stickySectionHeadersEnabled={false}
                    onEndReachedThreshold={20}
                    ListFooterComponent={this._renderListFooter}
                    renderSectionHeader={this._renderSectionHeader}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    sections={sections}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: colors.screenBackground,

    },
    slotMachineContainer: {
        width: '100%',
        height: 282,
        justifyContent: 'center',
    },
    adsContainer: {
        width: '100%',
        height: 278,
    },
    adsLabelContainer: {
        position: 'absolute',
        top: 20,
        left: 10,
    },
    labelGroup: {
        bottom: 20,
        right: 20,
        position: 'absolute',
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    bannerTitle: {
        fontSize: 15,
        color: colors.textWhitePrimary,
        textAlign: 'right'
    },
    bannerSubtitle: {
        fontSize: 12,
        color: colors.bannerSubtitleColor,
        flexWrap: "wrap",
        textAlign: 'right'
    },
    slotMachineImage: {
        width: '100%',
        height: '100%',
    },
    bannerPlayIconGroup: {
        alignSelf: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: 35,
        overflow: 'hidden',
    },
    bannerPlayIconBackground: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    bannerPlayIcon: {
        top: -1,
        left: -1,
        position: 'absolute',
        backgroundColor: 'transparent',
        width: 72,
        height: 72
    },
    listHorizontal: {
        marginVertical: 36,
        backgroundColor: colors.whitePrimary
    },
    itemLabel: {
        fontSize: 10,
        color: colors.textDarkGrey,
        marginTop: 5,
    },
    itemContainer: {
        marginLeft: 14,
        marginBottom: 0,
        backgroundColor: 'transparent',
        width: 87.4,
        height: 87.4,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 22,
        overflow: 'hidden',
    },
    itemContainerSeparator: {
        width: 0,
        height: 0
    },
    itemImage: {
        width: '100%',
        height: '100%',
    },
    headerSection: {
        flexDirection: 'row',
        marginLeft: 10,
        marginBottom: 21
    },
    liveThumbnailContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        marginRight: 7
    },
    textLiveVideoTitle: {
        ...textDarkDefault,
        marginTop: 18,
        width: 150,
        textAlign: 'center',
    },
    textLiveVideoInfo: {
        ...textLightDefault,
        width: 150,
        textAlign: 'center',
    },
    notificationContainer: {
        flexDirection: 'column',
        marginHorizontal: 10
    },
    notificationImage: {
        ...borderedImageDefault,
        width: '100%',
        height: 130,
        resizeMode: 'cover'
    },
    notificationTitle: {
        ...textDarkDefault,
        marginVertical: 5
    },
    notificationSubTitle: {
        ...textLightDefault
    },
    blurview: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        borderRadius: 50,
    },
    noInternetConnection: {
        color: colors.greyDescriptionText,
        textAlign: 'center',
        flexWrap: "wrap",
        marginHorizontal: 14,
    },
    addMoreCategoryContainer: {
        borderRadius: 4,
        borderWidth: 2,
        overflow: 'hidden',
        borderColor: "#95989A",
        width: 156,
        height: 74,
        justifyContent: 'center'
    },
    textCenter: {
        ...textDarkDefault,
        textAlign: 'center',
        alignSelf: 'center',
        width: 150
    },
    channelText: {
        fontSize: 10,
        color: 'rgba(92,92,92,0.73)',
        textAlign: 'center'
    },
    orientationButton: {
        width: 39,
        height: 33.73,
        position: 'absolute',
        bottom: 10.3,
        left: 13.5
    },
    bannerinfo: {
        flexDirection: 'column',
        position: 'absolute',
        width: '50%',
        bottom: 22,
        right: 16,
        justifyContent: 'flex-end',
        alignSelf: 'flex-end'
    },
    videoThumbnail: {
        width: 156,
        height: 74
    },
    errorMessage: {
        marginTop: 100,
        color: colors.whiteBackground,
        fontSize: 20,
        width: '100%',
        paddingHorizontal: 40,
        textAlign: 'center'
    },
    placeHolder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 50,
        zIndex: -1,
        borderWidth: 0.5,
        borderColor: colors.textGrey,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textPlaceHolder: {
        color: colors.textGrey
    }
});
