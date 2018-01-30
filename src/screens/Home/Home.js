/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {FlatList, Image, StyleSheet, Text, View, SectionList, ImageBackground, findNodeHandle} from 'react-native';
import PinkRoundedLabel from '../../components/PinkRoundedLabel';
import VideoThumbnail from '../../components/VideoThumbnail'
import {colors, textDarkDefault, textLightDefault} from '../../utils/themeConfig';

export default class Home extends Component {

    constructor(props) {
        super(props);
    };

    componentDidMount() {
        this.props.getBanner();
        this.props.getChannel();
        this.props.getLive();
        this.props.getVOD();
    };

    _renderChannelListItem = ({item}) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemImageContainer}>
                <Image
                  style={styles.itemImage}
                  resizeMode={'cover'}
                  source={{uri: 'http://www.direct-vs-dish.com/media/channel_logos/180px-CN_logo.svg_-e1314879342640.png.300x300_q85.png'}}/>
            </View>
            <Text
              numberOfLines={1}
              style={styles.itemLabel}>{item.title}</Text>
        </View>
    )

    _keyExtractor = (item, index) => item.id;

    _renderBanner = ({item}) => (
      <View style={styles.bannerContainer}>
          <Image
            style={styles.bannerImage}
            source={{uri: item.header_banner.cover_image}}/>
          <View style={styles.labelGroup}>
              <PinkRoundedLabel text="New Movie"/>
              <Text style={styles.bannerTitle}>
                {item.header_banner.title}
              </Text>
              <Text style={styles.bannerSubtitle}>
                {item.header_banner.sub_title}
              </Text>
          </View>
          <View style={styles.bannerPlayIconGroup}>
              <View
                ref={(playBackground) => { this.playBackground = playBackground; }}
                style={styles.bannerPlayIconBackground}/>
              <Image
                resizeMode={'contain'}
                style={styles.bannerPlayIcon}
                source={{uri: 'https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_play_arrow_48px-512.png'}}/>

          </View>
      </View>
    )

    _renderChannelList = ({item}) => (
          <FlatList
            style={styles.listHorizontal}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={item}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderChannelListItem} />
    )

  _renderOnLiveItem = ({item}) => (
    <View style={styles.videoThumbnailContainer}>
      <VideoThumbnail showProgress={true} progress="80%" imageUrl='https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'/>
      <Text numberOfLines={1} style={styles.textVideoTitle}>{item.title}</Text>
      <Text numberOfLines={1} style={styles.textVideoInfo}>{item.category}</Text>
      <Text numberOfLines={1} style={styles.textVideoInfo}>{item.time}</Text>
    </View>
  )

    _renderAds = () => (
      <ImageBackground style={styles.adsContainer} source={{uri: 'https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'}}>
          <View style={styles.adsLabelContainer}>
              <PinkRoundedLabel text="+10.00$/MONTH"/>
          </View>
      </ImageBackground>
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

    _renderVODList = ({item}) => (
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
    render() {
        const {banner, channel, live, vod} = this.props;
        if (!banner.data || banner.isFetching ||
          !channel.data || channel.isFetching ||
          !live.data || live.isFetching ||
          !vod.data || vod.isFetching)
            return null;
        return (
            <SectionList
              style={styles.container}
              keyExtractor={this._keyExtractor}
              stickySectionHeadersEnabled={true}
              renderSectionHeader={this._renderSectionHeader}
              sections={[
                {data:[banner.data], showHeader: false, renderItem: this._renderBanner},
                {data:[channel.data], showHeader: false, renderItem: this._renderChannelList},
                {data:["ads"], showHeader: false, renderItem: this._renderAds},
                {data:[live.data], title: "On Live", showHeader: true, renderItem: this._renderOnLiveList},
                {data:[vod.data], title: "On VOD", showHeader: true, renderItem: this._renderVODList}
              ]}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: colors.screenBackground,
    },
    bannerContainer: {
        width: '100%',
        aspectRatio: 1.3,
        justifyContent: 'center',
    },
    adsContainer: {
        width: '100%',
        aspectRatio: 1.3,
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
        marginTop: 10,
        fontSize: 15,
        color: colors.textWhitePrimary
    },
    bannerSubtitle: {
        marginTop: 5,
        fontSize: 12,
        color: colors.textGrey
    },
    bannerImage: {
        width: '100%',
        height: '100%'
    },
    bannerPlayIconGroup: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignSelf: 'center',
        justifyContent: 'center'
    },
    bannerPlayIconBackground: {
        borderRadius: 50,
        backgroundColor: colors.mainDarkGrey,
        width: '100%',
        height: '100%'
    },
    bannerPlayIcon: {
        position: 'absolute',
        width: '100%',
        height: '80%'
    },
    listHorizontal: {
        marginVertical: 30
    },
    itemLabel: {
        fontSize: 12,
        color: colors.textDarkGrey
    },
    itemContainer: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemImageContainer: {
        justifyContent: 'center',
        alignItems:'center',
        borderRadius: 10,
        backgroundColor: colors.mainLightGrey,
        width: 80,
        height: 80,
        overflow: 'hidden'
    },
    itemImage: {
        width: 80,
        height: 80,
    },
    headerSection: {
        flexDirection: 'row',
        marginLeft: 10,
        marginTop: 20,
        marginBottom: 15
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
    }
});
