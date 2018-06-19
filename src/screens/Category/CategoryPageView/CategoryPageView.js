import React, {Component} from 'react'
import {
    StyleSheet, Text, SectionList, View, Image, FlatList, Platform, Dimensions, TouchableOpacity, ActivityIndicator, InteractionManager
} from 'react-native'
import {colors, textDarkDefault, textLightDefault} from '../../../utils/themeConfig'
import {connect} from "react-redux";
import VideoThumbnail from '../../../components/VideoThumbnail'
import PinkRoundedLabel from '../../../components/PinkRoundedLabel';
import {secondFormatter, timeFormatter} from "../../../utils/timeUtils";
import {rootViewTopPadding} from "../../../utils/rootViewPadding";
import HeaderLabel from "../../../components/HeaderLabel";
import {getImageFromArray} from "../../../utils/images";
import { DotsLoader } from 'react-native-indicator'

class CategoryPageView extends Component{
    constructor(props){
        super(props);
        this.state = {
            latestVOD: null,
            epg: null,
            vod: null,
            latestVODLoading: false,
            epgLoading: false,
            vodLoading: false
        };
    }

    _keyExtractor = (item, index) => index.toString();

    _renderSlotMachines = ({item}) => {
        if (item == null) {
            return null;
        }
        return (

                <View style={styles.slotMachineContainer}>
                { item.map((it, index)=> {
                    let image = getImageFromArray(it.originalImages, 'feature', 'landscape');
                    return (
                        <TouchableOpacity key={index} onPress={()=>this.props.onVideoPress(it,false)}>
                            <Image
                                key={image + index}
                                style={styles.slotMachineImage}
                                source={{uri: image}}/>
                        </TouchableOpacity>
                    )
                })}
                </View>
        )
    };
    _renderOnLiveItem = ({item}) => {
        let image = getImageFromArray(item.videoData.originalImages, 'landscape', null);
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
            <TouchableOpacity onPress={()=>this.props.onVideoPress(item,true)}>
                <View style={styles.liveThumbnailContainer}>
                    <VideoThumbnail style={styles.liveVideo} showProgress={false} progress={progress + "%"} imageUrl={image} marginHorizontal={10}/>
                    <Text numberOfLines={1} style={styles.textLiveVideoTitle}>{item.videoData.title}</Text>
                    <Text numberOfLines={1} style={styles.textLiveVideoInfo}>{genres}</Text>
                    <Text numberOfLines={1} style={styles.textLiveVideoInfo}>{item.channelData.title}</Text>
                    <Text numberOfLines={1} style={styles.textLiveVideoInfo}>{timeInfo}</Text>
                </View>
            </TouchableOpacity>
        )
    };

    _renderVODItem = ({item}) => {
        let genres = '';
        if (item.genresData != null) {
            item.genresData.forEach((genre, index) => {
                if (genres.length != 0) {
                    genres = genres.concat(", ");
                }
                genres = genres.concat(genre.name.toString());
            })
        }
        return (
            <TouchableOpacity onPress={()=>this.props.onVideoPress(item,false)}>
                <View style={styles.vodThumbnailContainer}>
                    <VideoThumbnail style={styles.vodVideo} showProgress={false} imageUrl={getImageFromArray(item.originalImages, 'landscape', null)}/>
                    <View style={{flexDirection: 'column', marginTop: 0, paddingRight: 14, flex: 1}}>
                        <Text numberOfLines={2} style={styles.textVODTitle}>{item.title}</Text>
                        <Text numberOfLines={1} style={styles.textVODInfo}>{genres}</Text>
                        <Text numberOfLines={1} style={styles.textVODInfo}>{secondFormatter(item.durationInSeconds)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    _renderOnLiveList = ({item}) => {
        if (item == null) {
            return null
        }
        const {genresId} = this.props;
        return (
            <FlatList
                style={{flex: 1}}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={item}
                onEndReached={this._fetchMoreLive}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderOnLiveItem}/>
        )
    };


    _renderSectionHeader = ({section}) => {
        if (section.showHeader) {
            return (
                <View style={styles.headerSection}>
                    <PinkRoundedLabel text={section.title}/>
                </View>
            )
        } else {
            return <View style={{height: 0}}></View>
        }
    };

    _renderVODList = ({item}) => {
        if (item == null) {
            return null;
        }
        return (<FlatList
            style={{flex: 1}}
            horizontal={false}
            showsVerticalScrollIndicator={false}
            data={item}
            onEndReached={this._fetchMoreVOD}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderVODItem} />)
    }

    

    _renderVODFooter = () => {
        const {vod, genresId} = this.props;
        let vodMap = vod.vodMap.get(genresId);
        if (!vodMap)
            return null;
        if (vodMap.isFetching) {
            return (
                <View
                    style={{height: 50, width: '100%' ,justifyContent:'center', alignItems:'center'}}>
                    {/* <ActivityIndicator size={"small"} color={colors.textGrey}/> */}
                    <DotsLoader color={colors.textGrey} size={20} betweenSpace={10}/>
                </View>
            )
        } else {
            return null;
        }
    }

    _renderLiveFooter = () => {
        const {epg, genresId} = this.props;
        let epgMap = epg.epgMap.get(genresId);
        if (!epgMap)
            return null;
        if (epgMap.isFetching) {
            return (
                <View
                    style={{height: 74, width: 100 ,justifyContent:'center', alignItems:'center'}}>
                    {/* <ActivityIndicator size={"small"} color={colors.textGrey}/> */}
                    <DotsLoader color={colors.textGrey} size={20} betweenSpace={10}/>
                </View>
            )
        } else {
            return null;
        }
    }

    _fetchMoreLive = () => {
        const {genresId, epg} = this.props;
        let epgMap = epg.epgMap.get(genresId);
        if (epg.data != null) {
            if (this.props.epg.data.length === epgMap.skip * 10) {
                this.props.getEPG(10, epgMap.skip, genresId, new Date());
            }
        }
    }

    _fetchMoreVOD = () => {

        const {genresId, vod} = this.props;
        let vodMap = vod.vodMap.get(genresId);
        let vodPage = vodMap.page;
        if (vod.data != null) {
            if (vod.data.length === this.currentPage * 10) {
                vodPage++;
                this.props.getVODByGenres(vodPage, 10, genresId);
            }
        }


    }

    _renderListFooter = () => {
        const {vod, genresId, epg} = this.props;
        let vodMap = vod.vodMap.get(genresId);
        let epgMap = epg.epgMap.get(genresId);
        if (!vodMap || !epgMap)
            return null;
        if (epgMap.isFetching || vodMap.isFetching) {
            return (
                <View
                    style={{height: 74, width: 100 ,justifyContent:'center', alignItems:'center'}}>
                    {/* <ActivityIndicator size={"small"} color={colors.textGrey}/> */}
                    <DotsLoader color={colors.textGrey} size={20} betweenSpace={10}/>
                </View>
            )
        } else {
            return (
                <View style={{
                    width: '100%',
                    height: Dimensions.get("window").height * 0.08 + 20,
                    backgroundColor: 'transparent'
                }}/>
            );
        }      
    };


    render(){
        const {vod, epg, genresId} = this.props;
        let vodMap = vod.vodMap.get(genresId);
        let epgMap = epg.epgMap.get(genresId);
        let latestVOD = [];
        let vodData = [];
        let epgData= [];
        if (vodMap) {
            latestVOD = vodMap.latestVOD;
            vodData = vodMap.vod;
        }
        if (epgMap) {
            epgData = epgMap.epg;
        }
        return (
            <View keyExtractor={this._keyExtractor} style={styles.rootView}>
                <HeaderLabel position={this.props.pagePosition} text={this.props.header} keyExtractor={this._keyExtractor} goBack={()=>this.props.goBack()} showBackButton={false}/>
                <SectionList
                    style={[styles.container, {marginTop: 0, backgroundColor: colors.whiteBackground}]}
                    keyExtractor={this._keyExtractor}
                    stickySectionHeadersEnabled={false}
                    renderSectionHeader={this._renderSectionHeader}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    ListFooterComponent={this._renderListFooter}
                    sections={[
                        {data: [latestVOD], showHeader: false, renderItem: this._renderSlotMachines},
                        {data: [epgData], showHeader: epgData != null && epgData.length > 0, title: "ON LIVE", renderItem: this._renderOnLiveList},
                        {data: [vodData], showHeader: vodData != null && vodData.length > 0, title: "VOD", renderItem: this._renderVODList}
                    ]}
                />
            </View>
        )
    }
}

export default CategoryPageView;

const styles = StyleSheet.create({

    rootView: {
        marginTop: rootViewTopPadding(),
        width: '100%',
        height: '100%',
        backgroundColor: colors.whiteBackground,
        paddingBottom: (Platform.OS === 'ios') ? 30 : 0
    },

    slotMachineImage: {
        width: '100%',
        height: 178,
        resizeMode: 'cover'
    },
    slotMachineContainer: {
        width: '100%',
        justifyContent: 'center',
        backgroundColor: colors.screenBackground,
        top: 0,
        marginBottom: 36
    },
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: colors.screenBackground,
        marginTop: 30
    },
    liveThumbnailContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 21
    },
    textLiveVideoTitle: {
        color: '#313131',
        fontSize: 15,
        width: 156,
        textAlign: 'center',
    },
    textLiveVideoInfo: {
        color: '#ACACAC',
        fontSize: 12,
        width: 156,
        textAlign: 'center',
    },
    textVODTitle: {
        marginTop: 13,
        fontSize: 15,
        width: '100%',
        textAlign:'left',
        color: '#313131'
    },
    textVODInfo: {
        textAlign:'left',
        flexWrap: 'wrap',
        width: '100%',
        fontSize: 12,
        color: '#ACACAC'
    },
    headerSection: {
        flexDirection: 'row',
        marginLeft: 17,
        marginTop: 0,
        marginBottom: 21
    },
    vodThumbnailContainer: {
        flexDirection: 'row',
        marginBottom: 16
    },
    noInternetConnection: {
        color: colors.greyDescriptionText,
        textAlign: 'center',
        flexWrap: "wrap",
        fontSize: 15,
        marginHorizontal: 15
    },
    vodVideo: {
        width: 156,
        height: 74,
        marginLeft: 14,
        marginRight: 15
    },
    liveVideo: {
        width: 156,
        height: 74,
        marginHorizontal: 15,
        marginBottom: 21
    }
});