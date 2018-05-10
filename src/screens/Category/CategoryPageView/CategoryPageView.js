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
import {getImageFromArray} from "../../../utils/images";
import moment from "moment";
import {getEPGByGenres, getVODByGenres} from "../../../api";
import _ from 'lodash'
import {DotsLoader} from "react-native-indicator";

class CategoryPageView extends React.Component{
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
        this.epgQuerySkip = 0;
        this.vodQuerySkip = 0;
    }
    componentDidMount() {
        const {genresId} = this.props;
        this._getEPG(genresId, moment("May 1 08:00:00", "MMM DD hh:mm:ss"));
        this._getVOD(genresId);
        // this.props.getLatestVOD(genresId);
        // this.props.getEPG(10, 0, genresId, moment("May 1 08:00:00", "MMM DD hh:mm:ss"));
        // this.props.getVOD(10,3,genresId);
    };

    _getVOD = (genresId) => {
        this.setState({latestVODLoading: true, vodLoading: true});
        getVODByGenres(genresId, 10, this.vodQuerySkip).then((value)=> {
            let newVOD = value.data.viewer.videoMany;
            let newLatestVOD = this.state.latestVOD;
            let newBelowVOD = this.state.vod;
            if (newVOD == null) {
                this.setState({latestVODLoading: false, vodLoading: false});
                return
            }
            if (this.vodQuerySkip === 0) {
                // Update latestVOD
                newLatestVOD = newVOD.slice(0,3);
                newBelowVOD = newVOD.slice(3);
            } else {
                newBelowVOD = newBelowVOD.concat(newVOD);
            }
            this.vodQuerySkip = (newVOD != null) ? newVOD.length : 0;
            this.setState({latestVOD: newLatestVOD, vod: newBelowVOD, latestVODLoading: false, vodLoading: false})
        }).catch((err) => {
            console.log(err);
            this.setState({latestVODLoading: false, vodLoading: false});
        });
    };

    _getEPG = (genresId, currentTime) => {
        this.setState({epgLoading: true});
        getEPGByGenres(genresId, currentTime, 10, this.epgQuerySkip).then((value)=> {
            let newEPG = value.data.viewer.epgMany;
            if (this.state.epg != null) {
                newEPG = this.state.epg.concat(newEPG)
            }
            this.epgQuerySkip = (newEPG != null) ? newEPG.length : 0;
            this.setState({epg: newEPG, epgLoading: false});
        }).catch((err) => {
            console.log(err);
            this.setState({epgLoading: false});
        });
    };

    _getEPGFromScratch = (genresId, currentTime) => {
        console.log("Get EPG from Scratch");
        this.setState({epgLoading: true});
        getEPGByGenres(genresId, currentTime, 10, 0).then((value)=> {
            let newEPG = value.data.viewer.epgMany;
            this.epgQuerySkip = (newEPG != null) ? newEPG.length : 0;
            this.setState({epg: newEPG, epgLoading: false});
        }).catch((err) => {
            console.log(err);
            this.setState({epgLoading: false});
        });
    };

    _getVODFromScratch = (genresId) => {
        this.setState({latestVODLoading: true, vodLoading: true});
        getVODByGenres(genresId, 10, 0).then((value)=> {
            let newVOD = value.data.viewer.videoMany;
            if (newVOD == null) {
                this.setState({latestVODLoading: false, vodLoading: false});
                return
            }
            let newLatestVOD = newVOD.slice(0,3);
            let newBelowVOD = newVOD.slice(3);
            this.vodQuerySkip = (newVOD != null) ? newVOD.length : 0;
            this.setState({latestVOD: newLatestVOD, vod: newBelowVOD, latestVODLoading: false, vodLoading: false})
        }).catch((err) => {
            console.log(err);
            this.setState({latestVODLoading: false, vodLoading: false});
        });
    };

    _keyExtractor = (item, index) => index + "";

    _renderSlotMachines = ({item}) => {
        if (item == null) {
            return null;
        }
        return (

                <View style={styles.slotMachineContainer}>
                { item.map((it, index)=> {
                    let image = getImageFromArray(it.originalImages, 'feature', 'landscape');
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
    };
    _renderOnLiveItem = ({item}) => {
        console.log(item);
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
                refreshing={this.state.epgLoading}
                onRefresh={() => this._getEPGFromScratch(genresId, moment("May 1 08:00:00", "MMM DD hh:mm:ss"))}
                style={{flex: 1}}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={item}
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
            keyExtractor={this._keyExtractor}
            renderItem={this._renderVODItem} />)
    }

    _renderListFooter = () => (
        <View style={{
            width: '100%',
            height: Dimensions.get("window").height * 0.08 + 20,
            backgroundColor: 'transparent'
        }}/>
    );

    _onRefresh = ()=> {
        const {genresId} = this.props;
        this._getEPGFromScratch(genresId,moment("May 1 08:00:00", "MMM DD hh:mm:ss"));
        this._getVODFromScratch(genresId)
    };

    _fetchMore = ()=> {
        const {genresId} = this.props;
        let noEPGs = (this.state.epg == null) ? 0 : this.state.epg.length;
        if (noEPGs % 10 === 0 && noEPGs !== 0) {
            console.log("fetch more");
            this._getEPG(genresId, moment("May 1 08:00:00", "MMM DD hh:mm:ss"));
        }
        let noTopVOD = (this.state.latestVOD == null) ? 0 : this.state.latestVOD.length;
        let noBelowVOD = (this.state.vod == null) ? 0 : this.state.vod.length;

        if ((noTopVOD + noBelowVOD) % 10 === 0 && (noTopVOD + noBelowVOD) > 0) {
            console.log("fetch more");
            this._getVOD(genresId);
        }
    };

    render(){
        if (this.state.epgLoading && this.state.vodLoading && this.state.latestVODLoading) {
            return (
                <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
                    <DotsLoader color={colors.textGrey} size={20} betweenSpace={10}/>
                </View>
            );
        }
        return (
            <View keyExtractor={this._keyExtractor} style={styles.rootView}>
                <HeaderLabel position={this.props.pagePosition} text={this.props.header} keyExtractor={this._keyExtractor} goBack={()=>this.props.goBack()} showBackButton={true}/>
                <SectionList
                    refreshing={this.state.latestVODLoading && this.state.epgLoading}
                    onRefresh={()=>this._onRefresh()}
                    style={[styles.container, {marginTop: 0, backgroundColor: colors.whiteBackground}]}
                    keyExtractor={this._keyExtractor}
                    stickySectionHeadersEnabled={false}
                    renderSectionHeader={this._renderSectionHeader}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    onEndReached={this._fetchMore}
                    ListFooterComponent={this._renderListFooter}
                    sections={[
                        {data: [this.state.latestVOD], showHeader: false, renderItem: this._renderSlotMachines},
                        {data: [this.state.epg], showHeader: this.state.epg != null && this.state.epg.length > 0, title: "ON LIVE", renderItem: this._renderOnLiveList},
                        {data: [this.state.vod], showHeader: this.state.vod != null && this.state.vod.length > 0, title: "VOD", renderItem: this._renderVODList}
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