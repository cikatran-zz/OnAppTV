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
    Linking
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
import {getChannel} from "../../api";
import AlertModal from "../../components/AlertModal";
import {DotsLoader} from "react-native-indicator";

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            favoriteCategories: null,
            category: null,
            favoriteChannels: [null]
        }
        this.alertVC = null;
    };

    componentWillMount() {
        Orientation.lockToPortrait();
    }

    _setupFavoriteChannel = (channel) => {
        let channelData = channel ? channel.filter(item => item.favorite == 1 || item.favorite == true || item.favorite == 1.0) : [];
        if (channelData.length == 0) {
            channelData = [null];
        } else {
            this.setState({favoriteChannels: channelData});
        }
    };

    componentDidMount() {
        this.props.getBanner();
        this.props.getAds();
        this.props.getLive(new Date());
        this.props.getVOD(1, 10);
        this.props.getCategory();
        this.props.getNews();
        getChannel().then((response) => {
            this._setupFavoriteChannel(response);
        });

        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('light-content');
            (Platform.OS != 'ios') && StatusBar.setBackgroundColor('transparent');
            getChannel().then((response) => {
                this._setupFavoriteChannel(response);
            });
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
            <TouchableOpacity style={{padding: 0}} onPress={() => this._onChannelPress(item)}>
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
        NativeModules.STBManager.isConnect((connectString) => {
            let connected = JSON.parse(connectString).is_connected;
            if (connected) {
                NativeModules.STBManager.setZapWithJsonString(JSON.stringify({lCN: item.lCN}), (error, events) => {

                });
            } else {
                this.alertVC.setState({isShow: true, message: 'Connect STB to play this channel on TV'})
            }
        });
    };

    _renderChannelListItemSeparator = () => (
        <View style={styles.itemContainerSeparator}/>
    );

    _renderChannelList = ({item}) => {
        return (
            <FlatList
                style={styles.listHorizontal}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={this._renderChannelListItemSeparator}
                data={item}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderChannelListItem}/>
        )
    };

    _keyExtractor = (item, index) => index;

    // BANNER
    _renderBanner = ({item}) => {
        if (item == null) {
            return (
                <View style={styles.slotMachineContainer}>
                    <Text style={styles.noInternetConnection}>No data found. Please check the internet connection</Text>
                </View>
            )
        }
        let image = 'http://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder4.png';
        if (item.originalImages.length > 0) {
            image = item.originalImages[0].url;
        }
        return (
            <TouchableOpacity onPress={() => this._onVideoPress(item, false)}>
                <View style={styles.slotMachineContainer}>
                    <ImageBackground
                        style={styles.slotMachineImage}
                        source={{uri: image}}>
                        <View style={[styles.slotMachineImage, {backgroundColor: '#1C1C1C', opacity: 0.36}]}/>
                        <View style={styles.bannerinfo}>
                            <PinkRoundedLabel text="NEW MOVIE" style={{alignSelf: 'flex-end', marginBottom: 14}}/>
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
        if (item == null) {
            return (
                <View style={styles.adsContainer}>
                    <Text style={styles.noInternetConnection}>No data found. Please check the internet connection</Text>
                </View>
            )
        }
        let image = 'http://bec.edu.vn/rezise/resize?src=http://bec.edu.vn/asset/upload/Marketing-your-home.jpg&w=760&h=400';
        if (item.originalImages != null && item.originalImages.length > 0) {
            image = item.originalImages[0].url;
        }

        let url = item.url ? item.url : 'https://www.hi-global.tv';
        return (
            <TouchableOpacity onPress={() => Linking.openURL(url)} style={{marginBottom: 36}}>
                <ImageBackground style={styles.adsContainer} source={{uri: image}}>
                    <View style={styles.adsLabelContainer}>
                        <PinkRoundedLabel text={item.deal} style={{fontSize: 10, color: colors.whitePrimary}}/>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        )
    };

    _renderFooter = ({item}) => {
        if (item == null) {
            return (
                <View style={styles.notificationContainer}>
                    <Text style={styles.noInternetConnection}>No notification found.</Text>
                </View>
            )
        }
        var image = 'http://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder4.png';
        if (item.originalImages.length > 0) {
            image = item.originalImages[0].url;
        }
        return (
            <View style={styles.notificationContainer}>
                <Image style={styles.notificationImage} source={{uri: image}}/>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationSubTitle}>{item.shortDescription}</Text>
            </View>
        )
    };

    // ON LIVE
    _renderOnLiveItem = ({item}) => {
        if (item == null) {
            return null;
        }
        let image = 'https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg';
        if (item.videoData.originalImages.length > 0) {
            image = item.videoData.originalImages[0].url;
        }
        let genres = '';
        if (item.videoData.genresData != null && item.videoData.genresData.length > 0) {
            item.videoData.genresData.forEach((genre, index) => {
                if (genres.length != 0) {
                    genres = genres.concat(", ");
                }
                genres = genres.concat(genre.name.toString());
            })
        }
        let timeInfo = timeFormatter(item.startTime) + '-' + timeFormatter(item.endTime);

        let currentDate = (new Date()).getTime();
        let startDate = (new Date(item.startTime)).getTime();
        let endDate = (new Date(item.endTime)).getTime();
        let progress = (currentDate - startDate) / (endDate - startDate) * 100;
        return (
            <TouchableOpacity style={styles.liveThumbnailContainer} onPress={() => this._onVideoPress(item, true)}>
                <VideoThumbnail style={styles.videoThumbnail} showProgress={true} progress={progress + "%"} imageUrl={image}/>
                <Text numberOfLines={1} style={styles.textLiveVideoTitle}>{item.videoData.title}</Text>
                <Text numberOfLines={1} style={styles.textLiveVideoInfo}>{genres}</Text>
                <Text numberOfLines={1}
                      style={styles.textLiveVideoInfo}>{item.channelData ? item.channelData.title : ""}</Text>
                <Text numberOfLines={1} style={styles.textLiveVideoInfo}>{timeInfo}</Text>
            </TouchableOpacity>
        )
    };

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
            keyExtractor={this._keyExtractor}
            renderItem={this._renderOnLiveItem}/>)
    };

    _onVideoPress = (item, isLive) => {
        const {navigation} = this.props;

        navigation.navigate('LowerPageComponent', {
            item: item,
            isLive: isLive
        })
    };

    // ON VOD
    _renderVODItem = ({item}) => {

        let image = 'https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg';
        if (item.originalImages != null && item.originalImages.length > 0) {
            image = item.originalImages[0].url;
        }

        let genres = '';
        if (item.genresData != null && item.genresData.length > 0) {
            item.genresData.forEach((genre, index) => {
                if (genres.length != 0) {
                    genres = genres.concat(", ");
                }
                genres = genres.concat(genre.name.toString());
            })
        }
        return (
            <TouchableOpacity style={styles.liveThumbnailContainer} onPress={() => this._onVideoPress(item, false)}>
                <VideoThumbnail style={styles.videoThumbnail} showProgress={false} imageUrl={image}/>
                <Text numberOfLines={1} style={styles.textLiveVideoTitle}>{item.title}</Text>
                <Text numberOfLines={1} style={styles.textLiveVideoInfo}>{genres}</Text>
                <Text numberOfLines={1}
                      style={styles.textLiveVideoInfo}>{secondFormatter(item.durationInSeconds)}</Text>
            </TouchableOpacity>)
    };

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
                keyExtractor={this._keyExtractor}
                renderItem={this._renderVODItem}/>
        )
    }

    // CATEGORY

    _navigateToMyCategories = () => {
        const {navigate} = this.props.navigation;
        navigate('MyCategories', {data: this.state.category, updateFavorite: this._updateFavoriteCategories});
    };

    _navigateToCategory = (cate) => {
        const {navigation} = this.props;
        let data = this.state.category.filter(item => (item.favorite === true || item.favorite === 1.0));
        navigation.navigate('Category', {data: data, fromItem: cate});
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
                style={{flex: 1, marginBottom: 36, marginLeft: 7, marginRight: 8}}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={item}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderCategoryItem}/>
        )
    };

    _renderSectionHeader = ({section}) => {
        if (section.showHeader) {
            return (
                <View style={styles.headerSection}>
                    <PinkRoundedLabel text={section.title} style={{fontSize: 10, color: colors.whitePrimary}}/>
                </View>
            )
        } else {
            return null
        }
    }

    //Fix bottom tabbar overlay the List
    _renderListFooter = () => (
        <View style={{
            width: '100%',
            height: Dimensions.get("window").height * 0.08 + 20,
            backgroundColor: 'transparent'
        }}/>
    )

    _updateFavoriteCategories = (favorites) => {
        favorites.push({"name": "_ADD"});
        var data = this.state.category;
        for (var i = 0; i < data.length; i++) {
            data[i].favorite = 0;
            for (var j = 0; j < favorites.length; j++) {
                if (data[i].name == favorites[j].name) {
                    data[i].favorite = 1;
                }
            }
        }
        this.setState({favoriteCategories: favorites, category: data});
    };


    render() {
        const {banner, live, vod, ads, category, news} = this.props;
        if (!banner.fetched || banner.isFetching ||
            !ads.fetched || ads.isFetching ||
            !vod.fetched || vod.isFetching ||
            !category.fetched || category.isFetching ||
            !news.fetched || news.isFetching ||
            !live.fetched || live.isFetching)
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <DotsLoader color={colors.textGrey} size={20} betweenSpace={10}/>
                </View>
            );

        if (this.state.favoriteCategories == null) {
            var categoryData = (category.data == null ? [] : category.data).filter(item => (item.favorite === true || item.favorite === 1.0)).map(cate => ({"name": cate.name}));
            this.state.category = category.data == null ? [] : category.data;
            categoryData.push({"name": "_ADD"});
            this.state.favoriteCategories = categoryData;
        }

        let sections = [
            {data: [banner.data], showHeader: false, renderItem: this._renderBanner},
            {data: [this.state.favoriteChannels], showHeader: false, renderItem: this._renderChannelList},
            {data: [ads.data], showHeader: false, renderItem: this._renderAds}
            ];

        if (live.data != null && live.data.length > 0) {
            sections.push({data: [live.data], title: "ON LIVE", showHeader: true, renderItem: this._renderOnLiveList});
        }

        if (vod.data != null && vod.data.length > 0) {
            sections.push({data: [vod.data], title: "ON VOD", showHeader: true, renderItem: this._renderVODList});
        }

        sections.push({
            data: [this.state.favoriteCategories],
            title: "BY CATEGORY",
            showHeader: true,
            renderItem: this._renderCategoryList
        });

        sections.push({data: [news.data], title: "NOTIFICATION", showHeader: true, renderItem: this._renderFooter});

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
/**
 ,

 ,
 */

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
        height: '100%'
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
        aspectRatio: 2.5
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
    }
});
