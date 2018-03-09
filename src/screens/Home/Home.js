/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {FlatList, Image, StyleSheet, Text, View, SectionList, ImageBackground, Platform} from 'react-native';
import PinkRoundedLabel from '../../components/PinkRoundedLabel';
import VideoThumbnail from '../../components/VideoThumbnail'
import {colors, textDarkDefault, textLightDefault, borderedImageDefault} from '../../utils/themeConfig';
import BlurView from '../../components/BlurView'
import Orientation from 'react-native-orientation';
import BrightcovePlayer from '../../components/BrightcovePlayer'

const CATEGORY = ["Movie", "Sports", "Entertainment"];

export default class Home extends Component {

    constructor(props) {
        super(props);
    };

    componentWillMount() {
        Orientation.lockToPortrait();
    }

    componentDidMount() {
        this.props.getBanner();
        this.props.getChannel();
        this.props.getLive();
        this.props.getVOD();
    };

    _renderChannelListItem = ({item}) => {
      console.log("Thumbnail URL:",item.thumbnails[0].url);
      return (
        <View style={styles.itemContainer}>
            <View style={styles.itemImageContainer}>
                <Image
                  style={styles.itemImage}
                  resizeMode={'cover'}
                  source={{uri: item.thumbnails[0].url}}/>
            </View>
            <Text
              numberOfLines={1}
              style={styles.itemLabel}>{item.title}</Text>
        </View>
    )}

    _keyExtractor = (item, index) => index;

    _renderBanner = ({item}) => (
      <View style={styles.slotMachineContainer}>
          <Image
            style={styles.slotMachineImage}
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
                style={styles.bannerPlayIconBackground}>
              <BlurView blurRadius={100} overlayColor={1} style={styles.blurview}/>
              </View>
              <Image
                resizeMode={'contain'}
                style={styles.bannerPlayIcon}
                source={{uri: 'https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_play_arrow_48px-512.png'}}/>

          </View>
      </View>
    )

    _renderFooter = ({item}) => (
      <View style={styles.notificationContainer}>
        <Image style={styles.notificationImage} source={{uri: item.cover_image}}/>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationSubTitle}>{item.sub_title}</Text>
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
    <View style={styles.liveThumbnailContainer}>
      <VideoThumbnail showProgress={true} progress="80%" imageUrl='https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'/>
      <Text numberOfLines={1} style={styles.textLiveVideoTitle}>{item.title}</Text>
      <Text numberOfLines={1} style={styles.textLiveVideoInfo}>{item.category}</Text>
      <Text numberOfLines={1} style={styles.textLiveVideoInfo}>{item.time}</Text>
    </View>
  )

  _renderVODItem = ({item}) => (
    <View style={styles.liveThumbnailContainer}>
      <VideoThumbnail showProgress={false} imageUrl='https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg'/>
      <Text numberOfLines={1} style={styles.textLiveVideoTitle}>{item.title}</Text>
      <Text numberOfLines={1} style={styles.textLiveVideoInfo}>{item.category}</Text>
      <Text numberOfLines={1} style={styles.textLiveVideoInfo}>{item.time}</Text>
    </View>
  )

  _renderCategoryItem = ({item}) => (
    <View style={styles.liveThumbnailContainer}>
      <VideoThumbnail showProgress={false} textCenter={item} imageUrl='http://wallpoper.com/images/00/41/16/00/gaussian-blur_00411600.jpg' />
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
        renderItem={this._renderVODItem} />
    )

    _renderCategoryList = ({item}) => (
      <FlatList
        style={{flex: 1}}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={item}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderCategoryItem} />
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

    //Fix bottom tabbar overlay the List
    _renderListFooter = () => (
      <View style={{width: '100%', height: 50, backgroundColor:'transparent'}}/>
    )


    render() {
        const {banner, channel, live, vod} = this.props;
        if (!banner.data || banner.isFetching ||
          !channel.data || channel.isFetching ||
          !live.data || live.isFetching ||
          !vod.data || vod.isFetching)
            return null;
        return (
          <View style={{flex: 1, flexDirection: 'column'}}>
            <SectionList
              style={styles.container}
              keyExtractor={this._keyExtractor}
              stickySectionHeadersEnabled={false}
              onEndReachedThreshold={20}
              ListFooterComponent={ this._renderListFooter }
              renderSectionHeader={this._renderSectionHeader}
              sections={[
                {data:[banner.data], showHeader: false, renderItem: this._renderBanner},
                {data:[channel.data], showHeader: false, renderItem: this._renderChannelList},
                {data:["ads"], showHeader: false, renderItem: this._renderAds},
                {data:[live.data], title: "ON LIVE", showHeader: true, renderItem: this._renderOnLiveList},
                {data:[vod.data], title: "ON VOD", showHeader: true, renderItem: this._renderVODList},
                {data:[CATEGORY], title: "BY CATEGORY", showHeader: true, renderItem: this._renderCategoryList},
                {data:[banner.data.footer_banner], title: "WHAT'S NEW?", showHeader: true, renderItem: this._renderFooter},
              ]}
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
    slotMachineImage: {
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
        height: '100%',
        overflow: 'hidden'
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
    notificationContainer: {
      flexDirection: 'column',
      marginHorizontal: 10,
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
    right:0,
    top: 0,
    borderRadius: 50,
  },
});
