import React, {Component} from 'react'
import {
    StyleSheet, Text, SectionList, View, Image, FlatList, Platform, Dimensions, TouchableOpacity
} from 'react-native'
import {colors, textDarkDefault, textLightDefault} from '../../../utils/themeConfig'
import {connect} from "react-redux";
import VideoThumbnail from '../../../components/VideoThumbnail'
import PinkRoundedLabel from '../../../components/PinkRoundedLabel';
import {secondFormatter, timeFormatter} from "../../../utils/timeUtils";
import {rootViewTopPadding} from "../../../utils/rootViewPadding";
import HeaderLabel from "../../../components/HeaderLabel";

class CategoryPageView extends React.PureComponent{
    constructor(props){
        super(props);
    }
    componentDidMount() {
    };
    _keyExtractor = (item, index) => item.id;

    _getImage = (item) => {
        let image = 'http://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder4.png';
        if (item.originalImages.length > 0) {
            image = item.originalImages[0].url;
        }
        return image;
    }

    _getLandscapeImage = (item)=> {
        let image = 'http://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder4.png';
        if (item.originalImages.length > 0) {
            let landscapes = item.originalImages.filter(x=>(x.name === "landscape"));
            if (landscapes.length > 0 ) {
                image = landscapes[0].url;
            } else {
                image = item.originalImages[0].url;
            }
        }


        return image;
    }

    _renderSlotMachines = ({item}) => {
        return (

                <View style={styles.slotMachineContainer}>
                { item.map((it, index)=> {
                    let image = this._getLandscapeImage(it);
                    return (
                        <TouchableOpacity onPress={()=>this.props.onVideoPress(it,false)}>
                            <Image
                                key={image + index}
                                style={styles.slotMachineImage}
                                source={{uri: image}}/>
                        </TouchableOpacity>
                    )
                })}
                </View>
        )
    }
    _renderOnLiveItem = ({item}) => {
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
        var timeInfo = timeFormatter(item.startTime) + '-' + timeFormatter(item.endTime);

        var currentDate = (new Date()).getTime();
        var startDate = (new Date(item.startTime)).getTime();
        var endDate = (new Date(item.endTime)).getTime();
        var progress = (currentDate - startDate) / (endDate - startDate) * 100;
        return (
            <TouchableOpacity onPress={()=>this.props.onVideoPress(item,true)}>
                <View style={styles.liveThumbnailContainer}>
                    <VideoThumbnail style={styles.liveVideo} showProgress={true} progress={progress + "%"} imageUrl={image} marginHorizontal={10}/>
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
                    <VideoThumbnail style={styles.vodVideo} showProgress={false} imageUrl={this._getImage(item)}/>
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
        if (item == null || item[0] == null) {
            return (
                <View style={{flex: 1, marginBottom: 21}}>
                    <Text style={styles.noInternetConnection}>No data found. Please check the internet connection</Text>
                </View>
            )
        }
        return (<FlatList
            style={{flex: 1}}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={item}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderOnLiveItem}/>)
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

    _renderVODList = ({item}) => (
        <FlatList
            style={{flex: 1}}
            horizontal={false}
            showsVerticalScrollIndicator={false}
            data={item}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderVODItem} />
    );

    _renderListFooter = () => (
        <View style={{
            width: '100%',
            height: Dimensions.get("window").height * 0.08 + 20,
            backgroundColor: 'transparent'
        }}/>
    );

    render(){
        let sections = [];
        if (this.props.slotMachines.length > 0) {
            sections.push({data:[this.props.slotMachines], showHeader: false, renderItem: this._renderSlotMachines});
        }

        if (this.props.epgs.length > 0) {
            sections.push({data:[this.props.epgs], title: "ON LIVE", showHeader: true, renderItem: this._renderOnLiveList});
        }

        if (this.props.vod.length > 0) {
            sections.push({data:[this.props.vod], title: "VOD", showHeader: true, renderItem: this._renderVODList});
        }
        return (
            <View keyExtractor={this._keyExtractor} style={styles.rootView}>
                <HeaderLabel position={this.props.pagePosition} text={this.props.header} keyExtractor={this._keyExtractor} goBack={()=>this.props.goBack()} showBackButton={true}/>
                <SectionList
                    style={[styles.container, {marginTop: 0, backgroundColor: colors.whiteBackground}]}
                    keyExtractor={this._keyExtractor}
                    stickySectionHeadersEnabled={false}
                    renderSectionHeader={this._renderSectionHeader}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    ListFooterComponent={this._renderListFooter}
                    sections={sections}
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