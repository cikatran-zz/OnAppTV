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

class HeaderLabel extends React.PureComponent{
    constructor(props){
        super(props);
    }
    render(){
        if (this.props.position == 'end') {
            return (
                <View style={styles.headerView}>
                    <View style={[styles.backgroundHeaderView, styles.endHeaderView]}/>
                    <Text style={styles.headerLabel}>{this.props.text.toUpperCase()}</Text>
                    <TouchableOpacity onPress={()=>this.props.goBack()} style={styles.backButton}>
                        <Image source={require('../../../assets/ic_white_left_arrow.png')}/>
                    </TouchableOpacity>
                </View>

            )
        } else if (this.props.position == 'inside') {
            return (
                <View style={styles.headerView}>
                    <View style={[styles.backgroundHeaderView, styles.insideHeaderView]}/>
                    <Text style={styles.headerLabel}>{this.props.text.toUpperCase()}</Text>
                    <TouchableOpacity onPress={()=>this.props.goBack()} style={styles.backButton}>
                        <Image source={require('../../../assets/ic_white_left_arrow.png')}/>
                    </TouchableOpacity>

                </View>
            )
        } else if (this.props.position == 'begin') {
            return (
                <View style={styles.headerView}>
                    <View style={[styles.backgroundHeaderView, styles.beginHeaderView]}/>
                    <Text style={styles.headerLabel}>{this.props.text.toUpperCase()}</Text>
                    <TouchableOpacity onPress={()=>this.props.goBack()} style={styles.backButton}>
                        <Image source={require('../../../assets/ic_left_arrow.png')}/>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <Text >{this.props.text}</Text>
            )
        }
    }
}

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
                    <VideoThumbnail showProgress={true} progress={progress + "%"} imageUrl={image} marginHorizontal={10}/>
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
                    <VideoThumbnail showProgress={false} imageUrl={this._getImage(item)} marginHorizontal={20}/>
                    <View style={{flexDirection: 'column', alignSelf: 'center', marginTop: -9, paddingRight: 14, flex: 1}}>
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
        console.log("PAGE",this.props);
        return (
            <View keyExtractor={this._keyExtractor} style={styles.rootView}>
                <HeaderLabel position={this.props.pagePosition} text={this.props.header} keyExtractor={this._keyExtractor} goBack={()=>this.props.goBack()}/>
                <SectionList
                    style={[styles.container, {marginTop: 0}]}
                    keyExtractor={this._keyExtractor}
                    stickySectionHeadersEnabled={false}
                    renderSectionHeader={this._renderSectionHeader}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    ListFooterComponent={this._renderListFooter}
                    sections={[
                        {data:[this.props.slotMachines], showHeader: false, renderItem: this._renderSlotMachines},
                        {data:[this.props.epgs], title: "On Live", showHeader: true, renderItem: this._renderOnLiveList},
                        {data:[this.props.vod], title: "VOD", showHeader: true, renderItem: this._renderVODList}
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
        backgroundColor: colors.screenBackground,
        paddingBottom: (Platform.OS === 'ios') ? 30 : 0
    },

    slotMachineImage: {
        width: '100%',
        aspectRatio: 2.0,
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
    headerLabel: {
        fontSize: 10,
        alignSelf: 'center',
        paddingTop: 8,
        paddingBottom: 7,
        backgroundColor: colors.mainPink,
        borderRadius: (Platform.OS === 'ios') ? 15 : 30,
        overflow: "hidden",
        color: colors.whitePrimary,
        paddingHorizontal: 15
    },
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 17.5,
        marginBottom: 27
    },
    backgroundHeaderView: {
        backgroundColor: colors.mainPink,
        position: 'absolute',
        top: 0,
        height: '100%'
    },
    beginHeaderView : {
        left: '50%',
        width: '50%'
    },
    endHeaderView : {
        left: 0,
        width: '50%'
    },
    insideHeaderView : {
        left: 0,
        width: '100%'
    },
    liveThumbnailContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 21
    },
    textLiveVideoTitle: {
        ...textDarkDefault,
        width: 150,
        textAlign: 'center',
    },
    textLiveVideoInfo: {
        ...textLightDefault,
        width: 150,
        textAlign: 'center',
    },
    textVODTitle: {
        ...textDarkDefault,
        width: '100%',
        textAlign:'left',
    },
    textVODInfo: {
        ...textLightDefault,
        textAlign:'left',
        flexWrap: 'wrap',
        width: '100%'
    },
    headerSection: {
        flexDirection: 'row',
        marginLeft: 17,
        marginTop: 0,
        marginBottom: 21
    },
    vodThumbnailContainer: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    noInternetConnection: {
        color: colors.greyDescriptionText,
        textAlign: 'center',
        flexWrap: "wrap",
    },
    backButton: {
        paddingHorizontal: 15,
        paddingVertical: 6,
        left: 0,
        top: 0,
        position: 'absolute'
    }
});