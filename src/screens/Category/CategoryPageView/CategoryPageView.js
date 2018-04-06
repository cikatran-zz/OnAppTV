import React, {Component} from 'react'
import {
    StyleSheet, Text, SectionList, View, Image, FlatList, Platform, Dimensions
} from 'react-native'
import {colors, textDarkDefault, textLightDefault} from '../../../utils/themeConfig'
import {connect} from "react-redux";
import VideoThumbnail from '../../../components/VideoThumbnail'
import PinkRoundedLabel from '../../../components/PinkRoundedLabel';
import {secondFormatter} from "../../../utils/timeUtils";
import {rootViewTopPadding} from "../../../utils/rootViewTopPadding";

class HeaderLabel extends React.PureComponent{
    constructor(props){
        super(props);
    }
    render(){
        if (this.props.position == 'end') {
            return (
                <Text style={styles.endHeaderLabelStyle}>{this.props.text.toUpperCase()}</Text>
            )
        } else if (this.props.position == 'inside') {
            return (
                <Text style={styles.insideHeaderLabelStyle}>{this.props.text.toUpperCase()}</Text>
            )
        } else if (this.props.position == 'begin') {
            return (
                <Text style={styles.beginHeaderLabelStyle}>{this.props.text.toUpperCase()}</Text>
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

    _getImage(item) {
        let image = 'http://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder4.png';
        if (item.originalImages.length > 0) {
            image = item.originalImages[0].url;
        }
        return image;
    }
    _renderSlotMachines = ({item}) => {
        return (
            <View style={styles.slotMachineContainer}>
            { item.map((it, index)=> {
                let image = this._getImage(it);
                return (<Image
                    key={ image + index}
                    style={styles.slotMachineImage}
                    source={{uri: image}}/>
                )
            })}
            </View>
        )
    }
    _renderOnLiveItem = ({item}) => (
        <View style={styles.liveThumbnailContainer}>
            <VideoThumbnail showProgress={true} progress="80%" imageUrl='https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'/>
            <Text numberOfLines={1} style={styles.textLiveVideoTitle}>{item.title}</Text>
            <Text numberOfLines={1} style={styles.textLiveVideoInfo}>{item.category}</Text>
            <Text numberOfLines={1} style={styles.textLiveVideoInfo}>{item.time}</Text>
        </View>
    )

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
            <View style={styles.vodThumbnailContainer}>
                <View>
                    <VideoThumbnail showProgress={false} imageUrl={this._getImage(item)} marginHorizontal={20}/>
                </View>
                <View style={{alignSelf: 'stretch', flex: 1, alignItems: 'center', justifyContent:'center'}}>
                    <Text numberOfLines={2} style={styles.textVODTitle}>{item.title}</Text>
                    <Text numberOfLines={1} style={styles.textVODInfo}>{genres}</Text>
                    <Text numberOfLines={1} style={styles.textVODInfo}>{secondFormatter(item.durationInSeconds)}</Text>
                </View>
            </View>
        )
    }
    _renderOnLiveList = ({item}) => (
        <FlatList
            style={{flex: 1}}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={item}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderOnLiveItem} />
    )


    _renderSectionHeader = ({section}) => {
        if (section.showHeader) {
            return (
                <View style={styles.headerSection}>
                    <PinkRoundedLabel text={section.title}/>
                </View>
            )} else {
            return null
        }
    }
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
        return (
            <View keyExtractor={this._keyExtractor} style={styles.rootView}>
                <HeaderLabel position={this.props.pagePosition} text={this.props.header} keyExtractor={this._keyExtractor}/>
                <SectionList
                    style={styles.container}
                    keyExtractor={this._keyExtractor}
                    stickySectionHeadersEnabled={false}
                    renderSectionHeader={this._renderSectionHeader}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    ListFooterComponent={this._renderListFooter}
                    sections={[
                        {data:[this.props.slotMachines], renderItem: this._renderSlotMachines},
                        {data:[], title: "On Live", showHeader: true, renderItem: this._renderOnLiveList},
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
        top: 0
    },
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: colors.screenBackground,
        marginTop: 30
    },
    beginHeaderLabelStyle : {
        width: '60%',
        height: 30,
        overflow: "hidden",
        left: '50%',
        borderRadius: 15,
        paddingTop: 8,
        paddingHorizontal: 8,
        backgroundColor: colors.mainPink,
        fontSize: 13,
        color: colors.textWhitePrimary
    },
    endHeaderLabelStyle : {
        width: '60%',
        height: 30,
        overflow: "hidden",
        left: '-10%',
        borderRadius: 15,
        textAlign: 'right',
        paddingTop: 8,
        paddingHorizontal: 8,
        backgroundColor: colors.mainPink,
        fontSize: 13,
        color: colors.textWhitePrimary
    },
    insideHeaderLabelStyle : {
        width: '100%',
        height: 30,
        left: 0,
        textAlign: 'center',
        paddingTop: 8,
        paddingHorizontal: 8,
        backgroundColor: colors.mainPink,
        fontSize: 13,
        color: colors.textWhitePrimary
    },
    liveThumbnailContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textLiveVideoTitle: {
        ...textDarkDefault,
        width: 150,
        textAlign:'center',
    },
    textLiveVideoInfo: {
        ...textLightDefault,
        width: 150,
        textAlign:'center',
    },
    textVODTitle: {
        ...textDarkDefault,
        width: '100%',//Dimensions.get("window").width - 150,
        textAlign:'left',
    },
    textVODInfo: {
        ...textLightDefault,
        width: '100%',//Dimensions.get("window").width - 150,
        textAlign:'left',
    },
    headerSection: {
        flexDirection: 'row',
        marginLeft: 10,
        marginTop: 20,
        marginBottom: 15
    },
    vodThumbnailContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
});