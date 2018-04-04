/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  FlatList, Image, StyleSheet, Text, View, SectionList, ImageBackground, Platform, Dimensions,
  TouchableOpacity
} from 'react-native'
import PinkRoundedLabel from '../../components/PinkRoundedLabel';
import VideoThumbnail from '../../components/VideoThumbnail'
import BlurView from '../../components/BlurView'
import {
    colors, textDarkDefault, textLightDefault, borderedImageDefault,
    textWhiteDefault
} from '../../utils/themeConfig';
import {getBlurRadius} from '../../utils/blurRadius'
import {secondFormatter, timeFormatter} from "../../utils/timeUtils";

export default class Home extends Component {

    constructor(props) {
        super(props);
    };

    componentWillMount() {
        //Orientation.lockToPortrait();
    }

    componentDidMount() {
        this.props.getBanner();
        this.props.getChannel(-1);
        this.props.getAds();
        this.props.getLive(new Date());
        this.props.getVOD(1, 10);
        this.props.getCategory();
        this.props.getNews();
    };

    _renderChannelListItem = ({item}) => {
        var imageUrl = 'http://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder4.png';
        if (item.image != null) {
            imageUrl = item.image;
        }
      return (
        <View style={styles.itemContainer}>
            <View style={styles.itemImageContainer}>
                <Image
                  style={styles.itemImage}
                  resizeMode={'cover'}
                  source={{uri: imageUrl}}/>
            </View>
            <Text
              numberOfLines={1}
              style={styles.itemLabel}>{item.serviceName == null ? "" : item.serviceName.toString().toUpperCase()}</Text>
        </View>
    )}

    _renderChannelListItemSeparator = () => (
      <View style={styles.itemContainerSeparator}/>
    )

    _keyExtractor = (item, index) => index;

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
      <View style={styles.slotMachineContainer}>
          <Image
            style={styles.slotMachineImage}
            source={{uri: image}}/>
          <View style={styles.labelGroup}>
              <PinkRoundedLabel text="NEW MOVIE"/>
              <Text style={styles.bannerTitle}>
                {item.title}
              </Text>
              <Text style={styles.bannerSubtitle}>
                {item.shortDescription}
              </Text>
          </View>
          <View style={styles.bannerPlayIconGroup}>
              <BlurView style={styles.bannerPlayIconBackground} blurRadius={getBlurRadius(30)} overlayColor={1}/>
              <Image
                resizeMode={'cover'}
                style={styles.bannerPlayIcon}
                source={require('../../assets/ic_play_with_border.png')}/>
          </View>
      </View>
    )}

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

    _renderChannelList = ({item}) => {
        if (item == null || item[0] == null) {
            return (
                <View style={styles.listHorizontal}>
                    <Text style={styles.noInternetConnection}>No favorite channels</Text>
                </View>
            )
        }
        return (
          <FlatList
            style={styles.listHorizontal}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={this._renderChannelListItemSeparator}
            data={item}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderChannelListItem} />
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
      var progress = (currentDate-startDate)/(endDate - startDate) * 100;
        return (
          <View style={styles.liveThumbnailContainer}>
              <VideoThumbnail showProgress={true} progress={progress +"%"} imageUrl={image} marginHorizontal={10}/>
              <Text numberOfLines={1} style={styles.textLiveVideoTitle}>{item.videoData.title}</Text>
              <Text numberOfLines={1} style={styles.textLiveVideoInfo}>{item.genres}</Text>
              <Text numberOfLines={1} style={styles.textLiveVideoInfo}>{item.channelData.title}</Text>
              <Text numberOfLines={1} style={styles.textLiveVideoInfo}>{timeInfo}</Text>
          </View>
      )
  }

  _onVideoPress = (item) => {
      const {navigation} = this.props;

      navigation.navigate('VideoControlModal', {
        item: item
      })
  }

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
            <TouchableOpacity style={styles.liveThumbnailContainer} onPress={() => this._onVideoPress(item)}>
              <VideoThumbnail showProgress={false} imageUrl={image} marginHorizontal={10}/>
              <Text numberOfLines={1} style={styles.textLiveVideoTitle}>{item.title}</Text>
              <Text numberOfLines={1} style={styles.textLiveVideoInfo}>{genres}</Text>
              <Text numberOfLines={1} style={styles.textLiveVideoInfo}>{secondFormatter(item.durationInSeconds)}</Text>
            </TouchableOpacity>)
    };

  _renderCategoryItem = ({item}) => {
      if (item.name == "_ADD") {
          return (
              <View style={styles.liveThumbnailContainer}>
                  <View style={styles.addMoreCategoryContainer}>
                      <Text style={styles.textCenter}>ADD</Text>
                  </View>
              </View>
          )
      }
      return (
          <View style={styles.liveThumbnailContainer}>
              <VideoThumbnail showProgress={false} textCenter={item.name} marginHorizontal={10}/>
          </View>
      )
  };

    _renderAds = ({item}) => {
        if (item == null) {
            return (
                <View style={styles.adsContainer}>
                    <Text style={styles.noInternetConnection}>No data found. Please check the internet connection</Text>
                </View>
            )
        }
        let image = 'https://ninjaoutreach.com/wp-content/uploads/2017/03/Advertising-strategy.jpg';
        if (item.originalImages != null && item.originalImages.length > 0) {
            image = item.originalImages[0].url;
        }
        return (<ImageBackground style={styles.adsContainer} source={{uri: image}}>
          <View style={styles.adsLabelContainer}>
              <PinkRoundedLabel text={item.deal} style={{fontSize: 10, color: colors.whitePrimary}}/>
          </View>
        </ImageBackground>)
    };

    _renderOnLiveList = ({item}) => {
        if (item == null || item[0] == null) {
            return (
                <View style={{flex: 1}}>
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
          renderItem={this._renderOnLiveItem} />)
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
                style={{flex: 1}}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={item}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderVODItem} />
        )
    }

    _renderCategoryList = ({item}) => {
        return (
            <FlatList
                style={{flex: 1}}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={item}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderCategoryItem} />
        )
    };

    _renderSectionHeader = ({section}) => {
      if (section.showHeader) {
      return (
        <View style={styles.headerSection}>
          <PinkRoundedLabel text={section.title} style={{fontSize: 10, color: colors.whitePrimary}}/>
        </View>
      )} else {
        return null
      }
    }

    //Fix bottom tabbar overlay the List
    _renderListFooter = () => (
      <View style={{width: '100%', height: Dimensions.get("window").height*0.08 + 20, backgroundColor:'transparent'}}/>
    )


    render() {
        const {banner, channel, live, vod, ads, category, news} = this.props;
        if (!banner.fetched || banner.isFetching ||
            !channel.fetched || channel.isFetching ||
            !ads.fetched || ads.isFetching ||
            !vod.fetched || vod.isFetching ||
            !category.fetched || category.isFetching ||
            !news.fetched || news.isFetching ||
            !live.fetched || live.isFetching)
            return null;

        var channelData = channel.data.filter(item => item.favorite == 1);
        if (channelData.length == 0) {
            channelData = [null];
        }

        var categoryData = category.data.map(cate => ({"name": cate.name}));
        categoryData.push({"name": "_ADD"});

        return (
          <View style={{flex: 1, flexDirection: 'column'}}>
            <SectionList
              style={{backgroundColor: colors.whitePrimary, position: 'relative', flex: 1}}
              keyExtractor={this._keyExtractor}
              stickySectionHeadersEnabled={false}
              onEndReachedThreshold={20}
              ListFooterComponent={ this._renderListFooter }
              renderSectionHeader={this._renderSectionHeader}
              showsVerticalScrollIndicator={false}
              bounces={false}
              sections={[
                  {data:[banner.data], showHeader: false, renderItem: this._renderBanner},
                  {data:[channelData], showHeader: false, renderItem: this._renderChannelList},
                  {data:[ads.data], showHeader: false, renderItem: this._renderAds},
                  {data:[live.data], title: "ON LIVE", showHeader: true, renderItem: this._renderOnLiveList},
                  {data:[vod.data], title: "ON VOD", showHeader: true, renderItem: this._renderVODList},
                  {data:[categoryData], title: "BY CATEGORY", showHeader: true, renderItem: this._renderCategoryList},
                  {data:[news.data], title: "NOTIFICATION", showHeader: true, renderItem: this._renderFooter}
                ]}
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
        color: colors.bannerSubtitleColor,
        width: '90%',
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
        overflow: 'hidden'
    },
    bannerPlayIconBackground: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    bannerPlayIcon: {
        top: 0,
        left: 0,
        position: 'absolute',
      backgroundColor: 'transparent',
      width: '100%',
      height: '100%'
    },
    listHorizontal: {
        marginVertical: 30,
        backgroundColor: colors.whitePrimary
    },
    itemLabel: {
        fontSize: 10,
        color: colors.textDarkGrey,
        marginTop: 5,
    },
    itemContainer: {
        marginLeft: 5,
        backgroundColor: 'transparent',
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemContainerSeparator: {
        width: 0,
        height: 100
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
        right:0,
        top: 0,
        borderRadius: 50,
    },
    noInternetConnection: {
        color: colors.greyDescriptionText,
        textAlign: 'center',
        flexWrap: "wrap",
    },
    addMoreCategoryContainer: {
        borderRadius: 4,
        borderWidth: 2,
        overflow: 'hidden',
        borderColor: "#95989A",
        width: 150,
        height: "100%",
        marginVertical: 5,
        marginHorizontal: 10,
        justifyContent: 'center'
    },
    textCenter: {
        ...textDarkDefault,
        textAlign: 'center',
        alignSelf: 'center',
        width: 150
    }
});
