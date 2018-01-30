import React, {Component} from 'react'
import {
    StyleSheet, Text, SectionList, View, Image, FlatList, Platform
} from 'react-native'
import {colors, textDarkDefault, textLightDefault} from '../../../utils/themeConfig'
import {connect} from "react-redux";
import VideoThumbnail from '../../../components/VideoThumbnail'
import PinkRoundedLabel from '../../../components/PinkRoundedLabel';

class HeaderLabel extends React.PureComponent{
    constructor(props){
        super(props);
    }
    render(){
        if (this.props.position == 'end') {
            return (
                <Text style={styles.endHeaderLabelStyle}>{this.props.text}</Text>
            )
        } else if (this.props.position == 'inside') {
            return (
                <Text style={styles.insideHeaderLabelStyle}>{this.props.text}</Text>
            )
        } else if (this.props.position == 'begin') {
            return (
                <Text style={styles.beginHeaderLabelStyle}>{this.props.text}</Text>
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
        this.props.getLive();
    };
    _keyExtractor = (item, index) => item.id;
    _renderSlotMachines = ({item}) => {
        return (
            <View style={styles.slotMachineContainer}>
            { item.map((it, index)=> {
                return (<Image
                    keyExtractor={this._keyExtractor + index}
                    style={styles.slotMachineImage}
                    source={{uri: it.cover_image}}/>
                )
            })}
            </View>
        )
    }
    _renderOnLiveItem = ({item}) => (
        <View style={styles.videoThumbnailContainer}>
            <VideoThumbnail showProgress={true} progress="80%" imageUrl='https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'/>
            <Text numberOfLines={1} style={styles.textVideoTitle}>{item.title}</Text>
            <Text numberOfLines={1} style={styles.textVideoInfo}>{item.category}</Text>
            <Text numberOfLines={1} style={styles.textVideoInfo}>{item.time}</Text>
        </View>
    )
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

    render(){
        const {live} = this.props;
        if (!live.data || live.isFetching)
            return null;
        return (
            <View keyExtractor={this._keyExtractor} style={styles.rootView}>
                <HeaderLabel position={this.props.pagePosition} text={this.props.header} keyExtractor={this._keyExtractor}/>
                <SectionList
                    style={styles.container}
                    keyExtractor={this._keyExtractor}
                    stickySectionHeadersEnabled={true}
                    renderSectionHeader={this._renderSectionHeader}
                    showsVerticalScrollIndicator={false}
                    sections={[
                        {data:[this.props.slotMachines], renderItem: this._renderSlotMachines},
                        {data:[live.data], title: "On Live", showHeader: true, renderItem: this._renderOnLiveList}
                    ]}
                />
            </View>
        )
    }
}

export default CategoryPageView;

const styles = StyleSheet.create({

    rootView: {
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
        padding: 8,
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
        padding: 8,
        backgroundColor: colors.mainPink,
        fontSize: 13,
        color: colors.textWhitePrimary
    },
    insideHeaderLabelStyle : {
        width: '100%',
        height: 30,
        left: 0,
        textAlign: 'center',
        padding: 8,
        backgroundColor: colors.mainPink,
        fontSize: 13,
        color: colors.textWhitePrimary
    },
    videoThumbnailContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textVideoTitle: {
        ...textDarkDefault,
        width: 150,
        textAlign:'center',
    },
    textVideoInfo: {
        ...textLightDefault,
        width: 150,
        textAlign:'center',
    },
    headerSection: {
        flexDirection: 'row',
        marginLeft: 10,
        marginTop: 20,
        marginBottom: 15
    },
});